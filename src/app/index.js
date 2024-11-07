import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";  
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push('/tasks');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          Alert.alert("Erro ao fazer login", "Verifique o email e senha e tente novamente.");
        } else {
          Alert.alert("Erro ao fazer login", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#007BFF" />
      <Text style={styles.title}>
        <Text style={styles.ibm}>IBM</Text> TASK
      </Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>
      
      <Link style={styles.link} href='/register'>Cadastre-se</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 100 
  },
  ibm: { 
    color: '#007BFF' 
  },
  input: { 
    height: 40, 
    margin: 12, 
    width: '80%', 
    borderWidth: 1, 
    padding: 10 
  },
  button: { 
    backgroundColor: '#007BFF', 
    paddingVertical: 15, 
    width: '80%', 
    borderRadius: 10,
    marginTop: 20, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  link: { 
    marginTop: 40, 
    color: 'black', 
    fontSize: 16, 
    textDecorationLine: 'underline' 
  }
});

export default Home;
