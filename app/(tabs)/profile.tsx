import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../../constants/Colors';
import { getData } from '../../store/habitStore';
import { UserData } from '../../types';

export default function ProfileScreen() {
  const [data, setData] = useState<UserData | null>(null);
  useFocusEffect(useCallback(() => { getData().then(setData); }, []));

  if (!data) return <View style={styles.container} />;

  const bestHabit = data.habits.reduce((best, h) => h.streak > (best?.streak ?? 0) ? h : best, data.habits[0]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}><Ionicons name="person" size={32} color={Colors.primary} /></View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>Your Progress</Text>
          <Text style={styles.joinDate}>Since {new Date(data.joinDate).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</Text>
        </View>
        {!data.isPremium && (
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.push('/paywall')}>
            <Ionicons name="star" size={14} color={Colors.gold} />
            <Text style={styles.upgradeText}>Go Pro</Text>
          </TouchableOpacity>
        )}
      </View>

      {bestHabit && (
        <View style={styles.bestHabitCard}>
          <Text style={styles.bestHabitLabel}>🏆 Best Habit</Text>
          <View style={styles.bestHabitRow}>
            <View style={[styles.bestHabitIcon, { backgroundColor: bestHabit.color + '20' }]}>
              <Ionicons name={bestHabit.icon as any} size={22} color={bestHabit.color} />
            </View>
            <View>
              <Text style={styles.bestHabitName}>{bestHabit.name}</Text>
              <Text style={styles.bestHabitStreak}>{bestHabit.streak} day current streak</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.menuSection}>
        {[
          { icon: 'notifications-outline', label: 'Reminders & Notifications', color: Colors.primary },
          { icon: 'color-palette-outline', label: 'App Theme', color: Colors.secondary },
          { icon: 'download-outline', label: 'Export Data', color: Colors.accent },
          { icon: 'share-outline', label: 'Share HabitForge', color: '#8B5CF6' },
          { icon: 'star-outline', label: 'Rate the App', color: Colors.gold },
          { icon: 'help-circle-outline', label: 'Help & Support', color: Colors.textSecondary },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={18} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {!data.isPremium && (
        <TouchableOpacity style={styles.proCard} onPress={() => router.push('/paywall')}>
          <Ionicons name="star" size={24} color={Colors.gold} />
          <View style={styles.proCardInfo}>
            <Text style={styles.proCardTitle}>Upgrade to Pro</Text>
            <Text style={styles.proCardDesc}>Unlimited habits, AI insights, and more</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gold} />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: Spacing.lg },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary + '40' },
  headerInfo: { flex: 1 },
  name: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.text },
  joinDate: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  upgradeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold + '20', borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.gold + '40' },
  upgradeText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.gold },
  bestHabitCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.gold + '30', gap: 10 },
  bestHabitLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.gold },
  bestHabitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bestHabitIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  bestHabitName: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  bestHabitStreak: { fontSize: Fonts.sizes.xs, color: Colors.warning },
  menuSection: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: Fonts.sizes.md, color: Colors.text },
  proCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.gold + '15', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold + '40' },
  proCardInfo: { flex: 1 },
  proCardTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.gold },
  proCardDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
});
