import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../../constants/Colors';
import { getData } from '../../store/habitStore';
import { UserData } from '../../types';

export default function StatsScreen() {
  const [data, setData] = useState<UserData | null>(null);

  useFocusEffect(useCallback(() => { getData().then(setData); }, []));

  if (!data) return <View style={styles.container} />;

  const totalStreak = data.habits.reduce((s, h) => s + h.streak, 0);
  const bestStreak = data.habits.reduce((s, h) => Math.max(s, h.longestStreak), 0);
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const totalHabits = data.habits.length;

  // Last 7 days completion data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const completed = data.habits.filter(h => h.completedDates.includes(dateStr)).length;
    const total = data.habits.length;
    return { date: dateStr, day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()], completed, total, pct: total > 0 ? completed / total : 0 };
  });

  const maxBar = Math.max(...last7.map(d => d.completed), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Statistics</Text>

      <View style={styles.statsGrid}>
        {[
          { label: 'Active Habits', value: totalHabits, icon: 'checkmark-circle', color: Colors.primary },
          { label: 'Total Completions', value: data.totalCompletions, icon: 'trophy', color: Colors.gold },
          { label: 'Combined Streak', value: totalStreak, icon: 'flame', color: Colors.warning },
          { label: 'Best Streak', value: bestStreak, icon: 'star', color: Colors.secondary },
          { label: 'Tasks Done', value: completedTasks, icon: 'list', color: Colors.accent },
          { label: 'Days Active', value: Math.floor((Date.now() - new Date(data.joinDate).getTime()) / 86400000), icon: 'calendar', color: '#8B5CF6' },
        ].map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Ionicons name={s.icon as any} size={22} color={s.color} />
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* 7-Day Bar Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Last 7 Days</Text>
        <View style={styles.bars}>
          {last7.map((d, i) => (
            <View key={i} style={styles.barCol}>
              <Text style={styles.barValue}>{d.completed}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${(d.completed / maxBar) * 100}%` }]} />
              </View>
              <Text style={styles.barDay}>{d.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Per-Habit Stats */}
      {data.habits.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          {data.habits.map(h => {
            const days = Math.max(1, Math.floor((Date.now() - new Date(h.createdAt).getTime()) / 86400000));
            const rate = Math.round((h.completedDates.length / days) * 100);
            return (
              <View key={h.id} style={styles.habitStatRow}>
                <View style={[styles.habitIcon, { backgroundColor: h.color + '20' }]}>
                  <Ionicons name={h.icon as any} size={18} color={h.color} />
                </View>
                <View style={styles.habitStatInfo}>
                  <Text style={styles.habitStatName}>{h.name}</Text>
                  <View style={styles.habitStatBar}>
                    <View style={[styles.habitStatFill, { width: `${rate}%`, backgroundColor: h.color }]} />
                  </View>
                </View>
                <Text style={[styles.habitRate, { color: h.color }]}>{rate}%</Text>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },
  title: { fontSize: Fonts.sizes.xxxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.lg },
  statCard: { width: '47%', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: Fonts.sizes.xxl, fontWeight: '800' },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, textAlign: 'center' },
  chartCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  chartTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barValue: { fontSize: 9, color: Colors.textMuted, fontWeight: '700' },
  barTrack: { flex: 1, width: '100%', backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill: { backgroundColor: Colors.primary, borderRadius: 4, minHeight: 4 },
  barDay: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700' },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  habitStatRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.sm, marginBottom: 8, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  habitIcon: { width: 36, height: 36, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  habitStatInfo: { flex: 1, gap: 6 },
  habitStatName: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text },
  habitStatBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  habitStatFill: { height: '100%', borderRadius: 2 },
  habitRate: { fontSize: Fonts.sizes.sm, fontWeight: '800', minWidth: 36, textAlign: 'right' },
});
