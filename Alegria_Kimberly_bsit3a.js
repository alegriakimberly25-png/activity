import React, { createContext, useContext, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// CREATE GLOBAL CONTEXT

const CartContext = createContext();

const products = [
  { id: '1', name: 'T-Shirt', price: 250, emoji: '👕' },
  { id: '2', name: 'Shoes', price: 850, emoji: '👟' },
  { id: '3', name: 'Backpack', price: 500, emoji: '🎒' },
  { id: '4', name: 'Watch', price: 650, emoji: '⌚' },
  { id: '5', name: 'Headphones', price: 450, emoji: '🎧' },
];


// SHOP SCREEN

function ShopScreen() {
  const { cart, addToCart } = useContext(CartContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Shop 🛍️</Text>
      <Text style={styles.subtitle}>
        Choose your favorite products!
      </Text>

      <Text style={styles.cartInfo}>
        Items in Cart: {cart.length}
      </Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.emoji}>{item.emoji}</Text>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.name}
              </Text>

              <Text style={styles.price}>
                ₱{item.price}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                addToCart(item);
                Alert.alert('Success', 'Product added to cart!');
              }}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


// CART SCREEN

function CartScreen() {
  const { cart, removeFromCart } = useContext(CartContext);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Cart 🛒</Text>
      <Text style={styles.subtitle}>
        Your selected products
      </Text>

      <FlatList
        data={cart}
        keyExtractor={(item, index) => item.cartId}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.emoji}>{item.emoji}</Text>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.name}
              </Text>

              <Text style={styles.price}>
                ₱{item.price}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromCart(item.cartId)}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Your cart is empty. Add some products!
          </Text>
        }
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Price: ₱{totalPrice}
        </Text>
        <Text style={styles.itemCount}>
          Total Items: {cart.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}


// CREATE BOTTOM TAB NAVIGATION

const Tab = createBottomTabNavigator();


// MAIN APP WITH CONTEXT PROVIDER

export default function App() {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    const newItem = {
      ...product,
      cartId: Date.now().toString() + Math.random()
    };

    setCart(previousCart => [...previousCart, newItem]);
  };

  // Remove product from cart
  const removeFromCart = (cartId) => {
    setCart(previousCart =>
      previousCart.filter(item => item.cartId !== cartId)
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart }}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              height: 65,
              paddingBottom: 8,
              paddingTop: 8,
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          <Tab.Screen
            name="Shop"
            component={ShopScreen}
            options={{
              tabBarLabel: 'Shop',
              tabBarIcon: () => <Text style={{fontSize: 20}}>🛍️</Text>,
            }}
          />

          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              tabBarLabel: 'Cart',
              tabBarIcon: () => <Text style={{fontSize: 20}}>🛒</Text>,
              tabBarBadge: cart.length > 0 ? cart.length : undefined,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CartContext.Provider>
  );
}


// STYLES

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
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },

  cartInfo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 15,
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  emoji: {
    fontSize: 35,
    marginRight: 15,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  price: {
    fontSize: 15,
    color: '#2563EB',
    marginTop: 5,
  },

  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },

  removeButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 50,
    fontSize: 15,
  },

  totalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
  },

  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  itemCount: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },
});