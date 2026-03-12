import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Fonts } from '../../constants/Colors';
import { getData, toggleTask } from '../../store/habitStore';
import { Task } from '../../types';

const PRIORITY_COLORS: Record<string, string> = { high: Colors.error, medium: Colors.warning, low: Colors.textMuted };

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('active');

  useFocusEffect(useCallback(() => { getData().then(d => setTasks(d.tasks)); }, []));

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed);
  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  const handleToggle = async (id: string) => {
    await toggleTask(id);
    getData().then(d => setTasks(d.tasks));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-task')}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['active', 'all', 'done'] as const).map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'active' ? `(${tasks.filter(t => !t.completed).length})` : f === 'done' ? `(${tasks.filter(t => t.completed).length})` : `(${tasks.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {sorted.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>{filter === 'done' ? 'No completed tasks' : 'No tasks yet'}</Text>
            {filter !== 'done' && <TouchableOpacity style={styles.addTaskBtn} onPress={() => router.push('/add-task')}><Text style={styles.addTaskBtnText}>Add Task</Text></TouchableOpacity>}
          </View>
        ) : (
          sorted.map(task => (
            <TouchableOpacity key={task.id} style={[styles.taskCard, task.completed && styles.taskCardDone]} onPress={() => handleToggle(task.id)}>
              <View style={[styles.checkbox, task.completed && { backgroundColor: Colors.secondary, borderColor: Colors.secondary }]}>
                {task.completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleDone]}>{task.title}</Text>
                {task.description ? <Text style={styles.taskDesc} numberOfLines={1}>{task.description}</Text> : null}
                <View style={styles.taskMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_COLORS[task.priority] + '20' }]}>
                    <Text style={[styles.priorityText, { color: PRIORITY_COLORS[task.priority] }]}>{task.priority}</Text>
                  </View>
                  {task.dueDate && <Text style={styles.dueDate}>{new Date(task.dueDate).toLocaleDateString()}</Text>}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, paddingTop: 60 },
  title: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.text },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, gap: 8, marginBottom: Spacing.sm },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: BorderRadius.lg, backgroundColor: Colors.card, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#FFF' },
  list: { padding: Spacing.md, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Fonts.sizes.lg, color: Colors.textSecondary },
  addTaskBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, paddingHorizontal: 24, paddingVertical: 12 },
  addTaskBtnText: { color: '#FFF', fontWeight: '700', fontSize: Fonts.sizes.md },
  taskCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.card, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  taskCardDone: { opacity: 0.5 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  taskInfo: { flex: 1, gap: 4 },
  taskTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskDesc: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 2 },
  priorityText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  dueDate: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
});
