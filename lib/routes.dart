import 'package:flutter/material.dart';
import 'package:interesxpert/ui/screens/dashboard_screen.dart';
import 'package:interesxpert/ui/screens/register_screen.dart';
import 'ui/screens/home_screen.dart';
import 'ui/screens/login_screen.dart';

class AppRoutes {
  static const String home = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String dashboard = '/dashboard';

  static Map<String, WidgetBuilder> getRoutes() {
    return {
      home: (context) => const HomeScreen(),
      login: (context) => const LoginScreen(),
      register: (context) => const RegisterScreen(),
      dashboard: (context) => const DashboardScreen(),
    };
  }
}
