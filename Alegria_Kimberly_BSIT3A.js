
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Run when app starts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Display each user
  const renderUser = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.username}>@{item.username}</Text>

      <Text style={styles.info}>Email: {item.email}</Text>
      <Text style={styles.info}>City: {item.address.city}</Text>
      <Text style={styles.info}>Company: {item.company.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User Directory</Text>
      <Text style={styles.subtitle}>
        Data fetched from JSONPlaceholder API
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUser}
            ListEmptyComponent={
              <Text style={styles.empty}>No users found.</Text>
            }
          />

          <TouchableOpacity
            style={styles.button}
            onPress={fetchUsers}
          >
            <Text style={styles.buttonText}>Refresh Data</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  username: {
    color: '#64748B',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#334155',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#64748B',
  },
});