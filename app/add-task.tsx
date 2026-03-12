import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../constants/Colors';
import { addTask } from '../store/habitStore';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    await addTask({ title: title.trim(), description, priority, tags: [] });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={24} color={Colors.textSecondary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>New Task</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="What needs to be done?" placeholderTextColor={Colors.textMuted} autoFocus />
        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Add details..." placeholderTextColor={Colors.textMuted} multiline numberOfLines={3} />
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {(['low', 'medium', 'high'] as const).map(p => {
            const colors = { low: Colors.textMuted, medium: Colors.warning, high: Colors.error };
            return (
              <TouchableOpacity key={p} style={[styles.priorityBtn, priority === p && { backgroundColor: colors[p] + '20', borderColor: colors[p] }]} onPress={() => setPriority(p)}>
                <View style={[styles.priorityDot, { backgroundColor: colors[p] }]} />
                <Text style={[styles.priorityText, priority === p && { color: colors[p] }]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: Fonts.sizes.sm },
  content: { padding: Spacing.md },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  input: { backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: 14, color: Colors.text, fontSize: Fonts.sizes.md, borderWidth: 1, borderColor: Colors.border },
  textArea: { height: 80, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: BorderRadius.lg, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  priorityText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textSecondary },
});
