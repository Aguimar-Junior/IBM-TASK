import { StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleRegister = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário registrado:", user);
        setEmail('');
        setPassword('');
        Alert.alert(
          "Cadastro bem-sucedido!",
          "Usuário registrado com sucesso.",
          [{ text: "OK", onPress: () => router.push('/') }]
        );
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Erro ao registrar", errorMessage);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      
      <Link style={styles.link} href='/'>Voltar para login</Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    width: '80%',
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    width: '80%',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 40,
    bottom: 20,
    color: 'black',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Register;
