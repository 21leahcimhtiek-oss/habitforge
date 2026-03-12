import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../constants/Colors';
import { getData, toggleHabitToday, isHabitCompletedToday } from '../store/habitStore';
import { Habit } from '../types';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | null>(null);

  useEffect(() => { getData().then(d => setHabit(d.habits.find(h => h.id === id) || null)); }, []);

  if (!habit) return <View style={styles.container} />;

  const done = isHabitCompletedToday(habit);
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    return { date: dateStr, completed: habit.completedDates.includes(dateStr) };
  });

  const handleToggle = async () => {
    const data = await toggleHabitToday(habit.id);
    setHabit(data.habits.find(h => h.id === id) || null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: habit.color + '20' }]}>
            <Ionicons name={habit.icon as any} size={40} color={habit.color} />
          </View>
          <Text style={styles.title}>{habit.name}</Text>
          {habit.description ? <Text style={styles.desc}>{habit.description}</Text> : null}
          <Text style={[styles.category, { color: habit.color }]}>{habit.category.toUpperCase()}</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Current Streak', value: `${habit.streak}d`, icon: 'flame', color: Colors.warning },
            { label: 'Best Streak', value: `${habit.longestStreak}d`, icon: 'trophy', color: Colors.gold },
            { label: 'Total Done', value: habit.completedDates.length, icon: 'checkmark-circle', color: Colors.secondary },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon as any} size={20} color={s.color} />
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.checkBtn, done && { backgroundColor: Colors.secondary }]} onPress={handleToggle}>
          <Ionicons name={done ? 'checkmark-circle' : 'radio-button-off'} size={24} color="#FFF" />
          <Text style={styles.checkBtnText}>{done ? 'Completed Today!' : 'Mark as Done Today'}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Last 30 Days</Text>
        <View style={styles.heatmap}>
          {last30.map((d, i) => (
            <View key={i} style={[styles.heatCell, { backgroundColor: d.completed ? habit.color : Colors.card }]} />
          ))}
        </View>
        <View style={styles.heatLegend}>
          <View style={[styles.heatCell, { backgroundColor: Colors.card }]} /><Text style={styles.legendText}>Missed</Text>
          <View style={[styles.heatCell, { backgroundColor: habit.color }]} /><Text style={styles.legendText}>Completed</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8, backgroundColor: Colors.surface, borderRadius: BorderRadius.full },
  content: { padding: Spacing.md, paddingTop: 80, paddingBottom: 40 },
  hero: { alignItems: 'center', gap: 8, marginBottom: Spacing.lg },
  heroIcon: { width: 88, height: 88, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.text },
  desc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  category: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  statCard: { flex: 1, backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: Fonts.sizes.xl, fontWeight: '800' },
  statLabel: { fontSize: 9, color: Colors.textSecondary, textAlign: 'center' },
  checkBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: 18, marginBottom: Spacing.lg },
  checkBtnText: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: '#FFF' },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 8 },
  heatCell: { width: 28, height: 28, borderRadius: 6 },
  heatLegend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginRight: 12 },
});
