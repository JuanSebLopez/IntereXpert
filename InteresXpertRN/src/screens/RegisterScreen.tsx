import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth, User } from '../services/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, checkBiometricAvailability } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fingerprint, setFingerprint] = useState('');
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si la biometría está disponible cuando se carga el componente
  useEffect(() => {
    const checkBiometrics = async () => {
      const available = await checkBiometricAvailability();
      setBiometricsAvailable(available);
    };
    
    checkBiometrics();
  }, []);

  // Capturar biometría del dispositivo
  const captureBiometrics = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verifica tu identidad con biometría',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });
      
      if (biometricAuth.success) {
        setBiometricEnrolled(true);
        Alert.alert('Éxito', 'Biometría registrada correctamente');
      } else {
        Alert.alert('Error', 'No se pudo registrar la biometría');
      }
    } catch (error) {
      console.error('Error al registrar biometría:', error);
      Alert.alert('Error', 'Ocurrió un problema al registrar la biometría');
    }
  };

  const handleRegister = async () => {
    if (!name || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (useBiometrics && !biometricEnrolled) {
      Alert.alert('Error', 'Debes registrar tu biometría para continuar');
      return;
    }

    setLoading(true);

    try {
      const newUser: User = {
        name,
        username,
        password,
        useBiometrics: useBiometrics && biometricEnrolled,
        ...(fingerprint && { fingerprint })
      };

      // Simulamos un pequeño retraso para el registro
      setTimeout(() => {
        const registerSuccess = register(newUser);
        
        setLoading(false);
        
        if (registerSuccess) {
          Alert.alert(
            'Registro Exitoso', 
            'Tu cuenta ha sido creada correctamente',
            [{ text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          Alert.alert('Error', 'El nombre de usuario ya existe. Prueba con otro.');
        }
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo completar el registro. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  // Simulación de captura de huella
  const captureFingerprint = () => {
    // En un caso real, aquí integraríamos un lector de huellas
    // Por ahora, generamos un código único aleatorio
    const mockFingerprint = Math.random().toString(36).substring(2, 15);
    setFingerprint(mockFingerprint);
    Alert.alert('Huella capturada', 'La huella se ha registrado correctamente');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Opciones de biometría */}
          {biometricsAvailable && (
            <View style={styles.biometricContainer}>
              <View style={styles.fingerprintOption}>
                <Text style={styles.fingerprintText}>Usar biometría del dispositivo:</Text>
                <Switch
                  value={useBiometrics}
                  onValueChange={(value) => {
                    setUseBiometrics(value);
                    if (value && !biometricEnrolled) {
                      // Si se activa, abrir inmediatamente el escáner biométrico
                      captureBiometrics();
                    }
                  }}
                  trackColor={{ false: "#ddd", true: "#7B1FA2" }}
                  thumbColor={useBiometrics ? "#4527A0" : "#f4f3f4"}
                />
              </View>
              
              {useBiometrics && !biometricEnrolled && (
                <TouchableOpacity 
                  style={styles.biometricButton} 
                  onPress={captureBiometrics}
                >
                  <View style={styles.biometricButtonContent}>
                    <Text style={styles.biometricButtonText}>Registrar huella biométrica</Text>
                    <View style={styles.fingerprintIconContainer}>
                      <Text style={styles.fingerprintIcon}>👆</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              
              {useBiometrics && biometricEnrolled && (
                <View style={styles.enrolledContainer}>
                  <Text style={styles.enrolledText}>✓ Biometría registrada correctamente</Text>
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading || (useBiometrics && !biometricEnrolled)}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Procesando...' : 'Registrarse'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchButton}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    paddingVertical: 20,
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
    paddingVertical: 5,
  },
  fingerprintText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  biometricButton: {
    backgroundColor: '#4527A0',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  biometricButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  fingerprintIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintIcon: {
    fontSize: 20,
  },
  enrolledContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  enrolledText: {
    color: '#2E7D32',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7B1FA2',
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
    color: '#4527A0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 