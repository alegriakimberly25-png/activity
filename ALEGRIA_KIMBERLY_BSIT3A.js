import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved tasks when the app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Read data from local storage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('myTasks');

      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log('Error loading tasks:', error);
      Alert.alert('Error', 'Could not load saved tasks.');
    } finally {
      setIsLoaded(true);
    }
  };

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    if (isLoaded) {
      saveTasks();
    }
  }, [tasks, isLoaded]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('myTasks', JSON.stringify(tasks));
    } catch (error) {
      console.log('Error saving tasks:', error);
      Alert.alert('Error', 'Could not save tasks.');
    }
  };

  // Add a new task
  const addTask = () => {
    if (taskInput.trim() === '') {
      Alert.alert('Notice', 'Please enter a task first.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskInput.trim(),
      completed: false
    };

    setTasks(previousTasks => [...previousTasks, newTask]);
    setTaskInput('');
  };

  // Mark task as completed
  const toggleTask = (id) => {
    setTasks(previousTasks =>
      previousTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(previousTasks =>
      previousTasks.filter(task => task.id !== id)
    );
  };

  // Display each task
  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity
        style={styles.taskDetails}
        onPress={() => toggleTask(item.id)}
      >
        <Text style={styles.check}>
          {item.completed ? '☑' : '☐'}
        </Text>

        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedTask
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading saved tasks...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>My To-Do List</Text>
      <Text style={styles.subtitle}>
        Your tasks are saved on your device.
      </Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task..."
          value={taskInput}
          onChangeText={setTaskInput}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task Counter */}
      <Text style={styles.counter}>
        Total Tasks: {tasks.length} | Completed: {
          tasks.filter(task => task.completed).length
        }
      </Text>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Add your first task!
          </Text>
        }
      />

      <Text style={styles.footer}>
        Local Storage Enabled
      </Text>

    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 30,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 25,
  },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 15,
  },

  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  counter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 15,
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  taskDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  check: {
    fontSize: 23,
    marginRight: 10,
    color: '#2563EB',
  },

  taskText: {
    fontSize: 15,
    color: '#1E293B',
    flexShrink: 1,
  },

  completedTask: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },

  deleteButton: {
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 7,
    marginLeft: 8,
  },

  deleteText: {
    color: '#ac2323',
    fontWeight: 'bold',
    fontSize: 12,
  },

  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 40,
    fontSize: 15,
  },

  loading: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
  },

  footer: {
    textAlign: 'center',
    color: '#16A34A',
    marginVertical: 15,
    fontWeight: 'bold',
  },
});