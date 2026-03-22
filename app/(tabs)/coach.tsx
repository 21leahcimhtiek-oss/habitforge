import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Fonts, Spacing } from '../../constants/Colors';
import { getData } from '../../store/habitStore';
import { UserData } from '../../types';
import { useFocusEffect } from 'expo-router';

function buildTips(data: UserData | null): string[] {
  if (!data) return ['Syncing your progress...'];

  const activeHabits = data.habits.length;
  const completedTasks = data.tasks.filter((t) => t.completed).length;
  const pendingTasks = data.tasks.filter((t) => !t.completed).length;
  const longestStreak = data.habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  return [
    activeHabits < 3 ? 'Add one more daily habit to increase consistency momentum.' : 'Great job keeping multiple habits active.',
    pendingTasks > completedTasks ? 'Clear one high-priority task before noon to reduce cognitive load.' : 'Task completion is strong. Keep batching similar work blocks.',
    longestStreak < 7 ? 'Aim for a 7-day streak on one habit this week.' : 'Protect your streaks with small, non-negotiable daily minimums.',
  ];
}

export default function CoachScreen() {
  const [data, setData] = useState<UserData | null>(null);

  useFocusEffect(
    useCallback(() => {
      getData().then(setData);
    }, [])
  );

  const tips = useMemo(() => buildTips(data), [data]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>AI Coach</Text>
      <Text style={styles.subtitle}>Personalized productivity insights from your habit and task history.</Text>

      <View style={styles.metrics}>
        <View style={styles.metric}><Text style={styles.metricValue}>{data?.habits.length || 0}</Text><Text style={styles.metricLabel}>Habits</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{data?.tasks.filter((t) => !t.completed).length || 0}</Text><Text style={styles.metricLabel}>Open Tasks</Text></View>
        <View style={styles.metric}><Text style={styles.metricValue}>{data?.totalCompletions || 0}</Text><Text style={styles.metricLabel}>Completions</Text></View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Recommendations</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipRow}>
            <View style={styles.dot} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40, gap: 12 },
  title: { color: Colors.text, fontSize: Fonts.sizes.xl, fontWeight: '800' },
  subtitle: { color: Colors.textSecondary, fontSize: Fonts.sizes.sm },
  metrics: { flexDirection: 'row', gap: 10 },
  metric: { flex: 1, backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1, borderRadius: BorderRadius.lg, padding: 12, alignItems: 'center', gap: 2 },
  metricValue: { color: Colors.primary, fontSize: Fonts.sizes.xl, fontWeight: '800' },
  metricLabel: { color: Colors.textSecondary, fontSize: Fonts.sizes.xs },
  card: { backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1, borderRadius: BorderRadius.lg, padding: Spacing.md, gap: 10 },
  cardTitle: { color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary, marginTop: 7 },
  tipText: { flex: 1, color: Colors.textSecondary, fontSize: Fonts.sizes.sm, lineHeight: 20 },
});
