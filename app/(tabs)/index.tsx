import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../../constants/Colors';
import { getData, toggleHabitToday, isHabitCompletedToday, getTodayKey } from '../../store/habitStore';
import { UserData } from '../../types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TodayScreen() {
  const [data, setData] = useState<UserData | null>(null);

  useFocusEffect(useCallback(() => { getData().then(setData); }, []));

  const today = new Date();
  const todayHabits = data?.habits.filter(h => {
    if (h.frequency === 'daily') return true;
    return h.targetDays.includes(today.getDay());
  }) || [];
  const completedCount = todayHabits.filter(h => isHabitCompletedToday(h)).length;
  const progress = todayHabits.length > 0 ? completedCount / todayHabits.length : 0;

  const todayTasks = data?.tasks.filter(t => !t.completed).slice(0, 5) || [];

  const handleToggle = async (id: string) => {
    const updated = await toggleHabitToday(id);
    setData(updated);
  };

  // Generate last 7 days for mini calendar
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { date: d.toISOString().split('T')[0], day: DAYS[d.getDay()], num: d.getDate(), isToday: i === 6 };
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{DAYS[today.getDay()]}, {MONTHS[today.getMonth()]} {today.getDate()}</Text>
          <Text style={styles.title}>Today's Plan</Text>
        </View>
        <TouchableOpacity style={styles.proBtn} onPress={() => router.push('/paywall')}>
          <Ionicons name="star" size={14} color={Colors.gold} />
          <Text style={styles.proBtnText}>Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Mini Calendar */}
      <View style={styles.calendarRow}>
        {last7.map(d => (
          <View key={d.date} style={[styles.calDay, d.isToday && styles.calDayToday]}>
            <Text style={[styles.calDayLabel, d.isToday && styles.calDayLabelToday]}>{d.day}</Text>
            <Text style={[styles.calDayNum, d.isToday && styles.calDayNumToday]}>{d.num}</Text>
            {data?.habits.some(h => h.completedDates.includes(d.date)) && (
              <View style={[styles.calDot, d.isToday && { backgroundColor: '#FFF' }]} />
            )}
          </View>
        ))}
      </View>

      {/* Progress Ring */}
      <View style={styles.progressCard}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>Habit Progress</Text>
          <Text style={styles.progressSubtitle}>{completedCount} of {todayHabits.length} completed</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>

      {/* Today's Habits */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        <TouchableOpacity onPress={() => router.push('/add-habit')}>
          <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {todayHabits.length === 0 ? (
        <TouchableOpacity style={styles.emptyCard} onPress={() => router.push('/add-habit')}>
          <Ionicons name="add-circle" size={32} color={Colors.primary} />
          <Text style={styles.emptyText}>Add your first habit</Text>
        </TouchableOpacity>
      ) : (
        todayHabits.map(habit => {
          const done = isHabitCompletedToday(habit);
          return (
            <TouchableOpacity key={habit.id} style={[styles.habitRow, done && styles.habitRowDone]} onPress={() => handleToggle(habit.id)}>
              <View style={[styles.habitIcon, { backgroundColor: habit.color + '20' }]}>
                <Ionicons name={habit.icon as any} size={22} color={done ? Colors.textMuted : habit.color} />
              </View>
              <View style={styles.habitInfo}>
                <Text style={[styles.habitName, done && styles.habitNameDone]}>{habit.name}</Text>
                <View style={styles.habitMeta}>
                  <Ionicons name="flame" size={12} color={done ? Colors.textMuted : Colors.warning} />
                  <Text style={[styles.habitStreak, done && { color: Colors.textMuted }]}>{habit.streak} day streak</Text>
                </View>
              </View>
              <View style={[styles.checkCircle, done && { backgroundColor: habit.color, borderColor: habit.color }]}>
                {done && <Ionicons name="checkmark" size={16} color="#FFF" />}
              </View>
            </TouchableOpacity>
          );
        })
      )}

      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          {todayTasks.map(task => (
            <View key={task.id} style={styles.taskRow}>
              <View style={[styles.priorityDot, { backgroundColor: task.priority === 'high' ? Colors.error : task.priority === 'medium' ? Colors.warning : Colors.textMuted }]} />
              <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
              <Text style={[styles.priorityLabel, { color: task.priority === 'high' ? Colors.error : task.priority === 'medium' ? Colors.warning : Colors.textMuted }]}>{task.priority}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  dateText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  title: { fontSize: Fonts.sizes.xxxl, fontWeight: '800', color: Colors.text },
  proBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold + '20', borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.gold + '40' },
  proBtnText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.gold },
  calendarRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  calDay: { alignItems: 'center', padding: 6, borderRadius: BorderRadius.md, flex: 1 },
  calDayToday: { backgroundColor: Colors.primary },
  calDayLabel: { fontSize: 9, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
  calDayLabelToday: { color: 'rgba(255,255,255,0.8)' },
  calDayNum: { fontSize: Fonts.sizes.md, fontWeight: '800', color: Colors.textSecondary },
  calDayNumToday: { color: '#FFF' },
  calDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.secondary, marginTop: 2 },
  progressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: 16 },
  progressInfo: { flex: 1, gap: 6 },
  progressTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  progressSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  progressBar: { height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  progressCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary + '40' },
  progressPercent: { fontSize: Fonts.sizes.md, fontWeight: '800', color: Colors.primary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  seeAll: { fontSize: Fonts.sizes.sm, color: Colors.primary, fontWeight: '600' },
  emptyCard: { alignItems: 'center', gap: 10, backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', marginBottom: Spacing.md },
  emptyText: { fontSize: Fonts.sizes.md, color: Colors.textSecondary },
  habitRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  habitRowDone: { opacity: 0.6, borderColor: Colors.border },
  habitIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  habitInfo: { flex: 1, gap: 3 },
  habitName: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  habitNameDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  habitMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  habitStreak: { fontSize: Fonts.sizes.xs, color: Colors.warning, fontWeight: '600' },
  checkCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  taskRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.md, padding: Spacing.sm, marginBottom: 6, borderWidth: 1, borderColor: Colors.border, gap: 10 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  taskTitle: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text },
  priorityLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', textTransform: 'uppercase' },
});
