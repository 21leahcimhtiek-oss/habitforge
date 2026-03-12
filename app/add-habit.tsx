import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts, HABIT_COLORS, HABIT_ICONS } from '../constants/Colors';
import { addHabit } from '../store/habitStore';

const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Mindfulness', 'Productivity', 'Social', 'Finance', 'Other'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AddHabitScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [category, setCategory] = useState('Health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [targetDays, setTargetDays] = useState([0, 1, 2, 3, 4, 5, 6]);

  const toggleDay = (day: number) => {
    setTargetDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Please enter a habit name.'); return; }
    await addHabit({ name: name.trim(), description, icon: selectedIcon, color: selectedColor, frequency, targetDays, category, isPremium: false });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={24} color={Colors.textSecondary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>New Habit</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
            <Ionicons name={selectedIcon as any} size={32} color={selectedColor} />
          </View>
          <Text style={[styles.previewName, { color: selectedColor }]}>{name || 'Habit Name'}</Text>
        </View>

        <Text style={styles.label}>Habit Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Morning Run" placeholderTextColor={Colors.textMuted} maxLength={40} />

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Why is this habit important to you?" placeholderTextColor={Colors.textMuted} multiline numberOfLines={3} />

        <Text style={styles.label}>Icon</Text>
        <View style={styles.iconGrid}>
          {HABIT_ICONS.map(icon => (
            <TouchableOpacity key={icon} style={[styles.iconBtn, selectedIcon === icon && { backgroundColor: selectedColor + '30', borderColor: selectedColor }]} onPress={() => setSelectedIcon(icon)}>
              <Ionicons name={icon as any} size={22} color={selectedIcon === icon ? selectedColor : Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {HABIT_COLORS.map(color => (
            <TouchableOpacity key={color} style={[styles.colorBtn, { backgroundColor: color }, selectedColor === color && styles.colorBtnActive]} onPress={() => setSelectedColor(color)}>
              {selectedColor === color && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, category === cat && { backgroundColor: selectedColor, borderColor: selectedColor }]} onPress={() => setCategory(cat)}>
              <Text style={[styles.catText, category === cat && { color: '#FFF' }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.freqRow}>
          {(['daily', 'weekly'] as const).map(f => (
            <TouchableOpacity key={f} style={[styles.freqBtn, frequency === f && { backgroundColor: selectedColor, borderColor: selectedColor }]} onPress={() => setFrequency(f)}>
              <Text style={[styles.freqText, frequency === f && { color: '#FFF' }]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Target Days</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day, i) => (
            <TouchableOpacity key={day} style={[styles.dayBtn, targetDays.includes(i) && { backgroundColor: selectedColor, borderColor: selectedColor }]} onPress={() => toggleDay(i)}>
              <Text style={[styles.dayText, targetDays.includes(i) && { color: '#FFF' }]}>{day[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: Fonts.sizes.sm },
  content: { padding: Spacing.md, paddingBottom: 40 },
  preview: { alignItems: 'center', gap: 10, paddingVertical: Spacing.lg },
  previewIcon: { width: 72, height: 72, borderRadius: BorderRadius.xl, alignItems: 'center', justifyContent: 'center' },
  previewName: { fontSize: Fonts.sizes.xl, fontWeight: '800' },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 14, color: Colors.text, fontSize: Fonts.sizes.md, borderWidth: 1, borderColor: Colors.border },
  textArea: { height: 80, textAlignVertical: 'top' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconBtn: { width: 48, height: 48, borderRadius: BorderRadius.lg, backgroundColor: Colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  colorRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  colorBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorBtnActive: { borderWidth: 3, borderColor: '#FFF' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  catText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSecondary },
  freqRow: { flexDirection: 'row', gap: 10 },
  freqBtn: { flex: 1, paddingVertical: 12, borderRadius: BorderRadius.lg, backgroundColor: Colors.card, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  freqText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary },
  daysRow: { flexDirection: 'row', gap: 8 },
  dayBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.lg, backgroundColor: Colors.card, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  dayText: { fontSize: Fonts.sizes.xs, fontWeight: '800', color: Colors.textSecondary },
});
