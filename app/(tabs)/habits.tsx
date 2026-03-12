import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../../constants/Colors';
import { getData, deleteHabit, isHabitCompletedToday } from '../../store/habitStore';
import { Habit } from '../../types';

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useFocusEffect(useCallback(() => { getData().then(d => setHabits(d.habits)); }, []));

  const handleDelete = (id: string, name: string) => {
    Alert.alert(`Delete "${name}"?`, 'This will remove all your progress for this habit.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteHabit(id); setHabits(prev => prev.filter(h => h.id !== id)); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-habit')}>
          <Ionicons name="add" size={22} color="#FFF" />
          <Text style={styles.addBtnText}>New Habit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyText}>Start building positive habits that stick.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/add-habit')}>
              <Text style={styles.emptyBtnText}>Create First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          habits.map(habit => {
            const done = isHabitCompletedToday(habit);
            const completionRate = habit.completedDates.length > 0
              ? Math.round((habit.completedDates.length / Math.max(1, Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / 86400000))) * 100)
              : 0;

            return (
              <TouchableOpacity key={habit.id} style={styles.habitCard} onPress={() => router.push({ pathname: '/habit-detail', params: { id: habit.id } })} onLongPress={() => handleDelete(habit.id, habit.name)}>
                <View style={[styles.habitIconBig, { backgroundColor: habit.color + '20' }]}>
                  <Ionicons name={habit.icon as any} size={28} color={habit.color} />
                </View>
                <View style={styles.habitInfo}>
                  <View style={styles.habitTitleRow}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    {done && <View style={styles.doneBadge}><Ionicons name="checkmark" size={10} color="#FFF" /></View>}
                  </View>
                  <View style={styles.habitStats}>
                    <View style={styles.habitStat}>
                      <Ionicons name="flame" size={12} color={Colors.warning} />
                      <Text style={styles.habitStatText}>{habit.streak}d streak</Text>
                    </View>
                    <View style={styles.habitStat}>
                      <Ionicons name="trophy" size={12} color={Colors.gold} />
                      <Text style={styles.habitStatText}>{habit.longestStreak}d best</Text>
                    </View>
                    <View style={styles.habitStat}>
                      <Ionicons name="analytics" size={12} color={Colors.secondary} />
                      <Text style={styles.habitStatText}>{completionRate}% rate</Text>
                    </View>
                  </View>
                  <View style={styles.miniBar}>
                    <View style={[styles.miniBarFill, { width: `${Math.min(100, completionRate)}%`, backgroundColor: habit.color }]} />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity style={styles.templateSection} onPress={() => router.push('/paywall')}>
          <Ionicons name="sparkles" size={18} color={Colors.primary} />
          <Text style={styles.templateText}>Unlock 50+ habit templates with Pro</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, paddingTop: 60 },
  title: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.text },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingHorizontal: 16, paddingVertical: 10 },
  addBtnText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: '#FFF' },
  content: { padding: Spacing.md, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: Fonts.sizes.xl, fontWeight: '700', color: Colors.textSecondary },
  emptyText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, textAlign: 'center' },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: Fonts.sizes.md },
  habitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  habitIconBig: { width: 52, height: 52, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  habitInfo: { flex: 1, gap: 6 },
  habitTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  habitName: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  doneBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  habitStats: { flexDirection: 'row', gap: 12 },
  habitStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  habitStatText: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  miniBar: { height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 2 },
  templateSection: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary + '10', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '30', marginTop: Spacing.md },
  templateText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.primary, fontWeight: '600' },
});
