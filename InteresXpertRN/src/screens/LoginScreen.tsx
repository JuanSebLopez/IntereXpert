import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, Switch, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../services/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loginWithBiometrics, isBiometricAvailable, checkBiometricAvailability } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si la biometría está disponible cuando se carga el componente
  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await checkBiometricAvailability();
      setBiometricsAvailable(available);
    };
    
    checkBiometrics();
  }, []);

  const handleLogin = async () => {
    if (!username || (!useBiometrics && !password)) {
      Alert.alert('Error', 'Por favor, ingresa la información requerida');
      return;
    }

    setLoading(true);

    try {
      if (useBiometrics) {
        await handleBiometricLogin();
      } else {
        // Inicio de sesión tradicional con contraseña
        const loginSuccess = await login(username, password);
        
        setLoading(false);
        
        if (loginSuccess) {
          navigation.navigate('Main');
        } else {
          Alert.alert('Error', 'Credenciales incorrectas. Inténtalo de nuevo.');
        }
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo iniciar sesión. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  // Función para manejar el inicio de sesión con biometría
  const handleBiometricLogin = async () => {
    if (!username) {
      Alert.alert('Error', 'Por favor, ingresa tu nombre de usuario');
      setLoading(false);
      return;
    }

    try {
      // Primero autenticar con biometría
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticar con huella digital',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });
      
      if (biometricAuth.success) {
        // Si la autenticación biométrica es exitosa, intentar iniciar sesión
        const loginSuccess = await loginWithBiometrics(username);
        
        setLoading(false);
        
        if (loginSuccess) {
          navigation.navigate('Main');
        } else {
          Alert.alert('Error', 'La autenticación biométrica no está habilitada para este usuario.');
        }
      } else {
        setLoading(false);
        Alert.alert('Error', 'Autenticación biométrica cancelada o fallida.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo iniciar sesión con biometría.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        {!useBiometrics && (
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        )}
        
        {/* Opciones de biometría */}
        {biometricsAvailable && (
          <View style={styles.biometricContainer}>
            <View style={styles.fingerprintOption}>
              <Text style={styles.fingerprintText}>Usar biometría:</Text>
              <Switch
                value={useBiometrics}
                onValueChange={setUseBiometrics}
                trackColor={{ false: "#ddd", true: "#7B1FA2" }}
                thumbColor={useBiometrics ? "#4527A0" : "#f4f3f4"}
              />
            </View>
            
            {useBiometrics && (
              <View style={styles.biometricInfo}>
                <Text style={styles.biometricInfoText}>
                  Se te solicitará autenticar con tu huella cuando inicies sesión
                </Text>
              </View>
            )}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading || (!username || (!useBiometrics && !password))}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Procesando...' : useBiometrics ? 'Iniciar Sesión con Biometría' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.switchButton}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginVertical: 20,
  },
  backButton: {
    fontSize: 18,
    color: '#4527A0',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4527A0',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  biometricContainer: {
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  fingerprintOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fingerprintText: {
    fontSize: 16,
    color: '#333',
  },
  biometricInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
  },
  biometricInfoText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4527A0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    color: '#555',
    fontSize: 16,
  },
  switchButton: {
    color: '#7B1FA2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 