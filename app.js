import React, { createContext, useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Global Context
const TaskContext = createContext();

const Tab = createBottomTabNavigator();

// Home Screen
function HomeScreen() {
  const { tasks } = useContext(TaskContext);

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Planner</Text>
      <Text style={styles.subtitle}>Welcome to your study dashboard!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Tasks</Text>
        <Text style={styles.number}>{tasks.length}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pending Tasks</Text>
        <Text style={styles.number}>{pending}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Completed Tasks</Text>
        <Text style={styles.number}>{completed}</Text>
      </View>

      <Text style={styles.message}>
        Stay organized and finish your activities!
      </Text>
    </View>
  );
}

// My Tasks Screen
function TasksScreen() {
  const { tasks, addTask, toggleTask, deleteTask } =
    useContext(TaskContext);

  const [input, setInput] = useState('');

  const handleAddTask = () => {
    if (input.trim() === '') {
      Alert.alert('Notice', 'Please enter a task.');
      return;
    }

    addTask(input.trim());
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your school task..."
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>+ Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add your first task!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskTextContainer}
              onPress={() => toggleTask(item.id)}
            >
              <Text style={styles.taskText}>
                {item.done ? '✅ ' : '⬜ '}
                {item.title}
              </Text>
              <Text style={styles.status}>
                {item.done ? 'Completed' : 'Pending'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Main Application
export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Study React Native', done: false },
    { id: '2', title: 'Finish school assignment', done: true },
  ]);

  const addTask = (title) => {
    const newTask = {
      id: Date.now().toString(),
      title: title,
      done: false,
    };

    setTasks(previous => [...previous, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(previous =>
      previous.map(task =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(previous =>
      previous.filter(task => task.id !== id)
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask }}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#245B50' },
            headerTintColor: '#FFFFFF',
            tabBarActiveTintColor: '#245B50',
            tabBarInactiveTintColor: '#888888',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="My Tasks" component={TasksScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskContext.Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#245B50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#245B50',
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    color: '#245B50',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#245B50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333333',
  },
  status: {
    fontSize: 12,
    color: '#777777',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 9,
    borderRadius: 7,
    marginLeft: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 30,
  },
});
