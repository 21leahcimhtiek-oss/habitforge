import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../constants/Colors';

const FEATURES = [
  { icon: 'infinite', text: 'Unlimited habits (free: 5 max)', color: Colors.primary },
  { icon: 'sparkles', text: 'AI habit coach & recommendations', color: Colors.secondary },
  { icon: 'analytics', text: 'Advanced analytics & insights', color: Colors.accent },
  { icon: 'notifications', text: 'Smart reminders & nudges', color: '#8B5CF6' },
  { icon: 'apps', text: '50+ habit templates library', color: Colors.error },
  { icon: 'download-outline', text: 'Export data to CSV', color: Colors.success },
];

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleSubscribe = () => {
    Alert.alert('Start HabitForge Pro', `${selectedPlan === 'yearly' ? '$29.99/year' : '$3.99/month'} — 7-day free trial.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Start Free Trial', onPress: () => { Alert.alert('Welcome to HabitForge Pro!', '', [{ text: 'Build Habits!', onPress: () => router.back() }]); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Text style={{ fontSize: 40 }}>🔥</Text></View>
          <Text style={styles.title}>HabitForge Pro</Text>
          <Text style={styles.subtitle}>Build life-changing habits with AI-powered coaching</Text>
        </View>

        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon as any} size={16} color={f.color} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {[
            { id: 'monthly', label: 'Monthly', price: '$3.99', period: '/month', note: 'Billed monthly' },
            { id: 'yearly', label: 'Yearly', price: '$29.99', period: '/year', note: 'Save 37% · Best Value', isPopular: true },
          ].map(plan => (
            <TouchableOpacity key={plan.id} style={[styles.planCard, selectedPlan === plan.id && styles.planCardActive, plan.isPopular && styles.planPopular]} onPress={() => setSelectedPlan(plan.id)}>
              {plan.isPopular && <View style={styles.popularBadge}><Text style={styles.popularText}>BEST VALUE</Text></View>}
              <View style={styles.planLeft}>
                <View style={[styles.radio, selectedPlan === plan.id && styles.radioActive]}>
                  {selectedPlan === plan.id && <View style={styles.radioDot} />}
                </View>
                <View style={{ marginTop: plan.isPopular ? 12 : 0 }}>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  <Text style={styles.planNote}>{plan.note}</Text>
                </View>
              </View>
              <View style={{ marginTop: plan.isPopular ? 12 : 0, alignItems: 'flex-end' }}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeText}>Start 7-Day Free Trial</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>Cancel anytime. No charges during trial.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8, backgroundColor: Colors.surface, borderRadius: BorderRadius.full },
  content: { padding: Spacing.md, paddingTop: 80, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: Spacing.xl },
  heroIcon: { width: 80, height: 80, borderRadius: BorderRadius.xl, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md, borderWidth: 2, borderColor: Colors.primary + '40' },
  title: { fontSize: Fonts.sizes.xxxl, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  subtitle: { fontSize: Fonts.sizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24, maxWidth: 280 },
  featuresCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { width: 32, height: 32, borderRadius: BorderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text, fontWeight: '500' },
  plans: { gap: 12, marginBottom: Spacing.lg },
  planCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 2, borderColor: Colors.border, position: 'relative', overflow: 'hidden' },
  planCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  planPopular: { borderColor: Colors.gold },
  popularBadge: { position: 'absolute', top: 0, left: 0, backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 3, borderBottomRightRadius: BorderRadius.sm },
  popularText: { fontSize: 9, fontWeight: '800', color: '#000' },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  planLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  planNote: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  planPrice: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.text },
  planPeriod: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  subscribeButton: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingVertical: 18, alignItems: 'center', marginBottom: Spacing.sm },
  subscribeText: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: '#FFF' },
  disclaimer: { textAlign: 'center', fontSize: Fonts.sizes.xs, color: Colors.textMuted },
});
