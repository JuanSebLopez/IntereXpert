import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importaciones de pantallas (se crearán después)
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SimpleInterestScreen from "../screens/SimpleInterestScreen";
import CompoundRateInterestScreen from "../screens/CompoundRateInterestScreen";
import AnnuityScreen from "../screens/AnnuityScreen";
import GradientScreen from "../screens/GradientScreen";
import AmortizationScreen from "../screens/AmortizationScreen";
import AdvancedCalculationsScreen from "../screens/AdvancedCalculationsScreen";
import TIRScreen from "../screens/TIRScreen";

// Definición de tipos para los parámetros de navegación
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Gradient: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  SimpleInterest: undefined;
  CompoundInterest: undefined;
  SimpleRateInterest: undefined;
  CompoundRateInterest: undefined;
  Annuity: undefined;
  GradientScreen: undefined;
  AmortizationScreen: undefined;
  AdvancedCalculations: undefined;
  TIR: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navegador de pestañas para la sección principal
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="SimpleInterest" component={SimpleInterestScreen} />
      <Tab.Screen
        name="CompoundRateInterest"
        component={CompoundRateInterestScreen}
      />
      <Tab.Screen name="Annuity" component={AnnuityScreen} />
      <Tab.Screen name="GradientScreen" component={GradientScreen} />
      <Tab.Screen name="AmortizationScreen" component={AmortizationScreen} />
      <Tab.Screen
        name="AdvancedCalculations"
        component={AdvancedCalculationsScreen}
      />
      <Tab.Screen name="TIR" component={TIRScreen} />
    </Tab.Navigator>
  );
};

// Componente principal que combina NavigationContainer
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 