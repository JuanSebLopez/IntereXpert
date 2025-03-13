import 'package:flutter/material.dart';
import 'package:interesxpert/ui/screens/dashboard_screen.dart';
import 'package:interesxpert/ui/screens/rate_interest_screen.dart';
import 'package:interesxpert/ui/screens/register_screen.dart';
import 'package:interesxpert/ui/screens/simple_interest_screen.dart';
import 'ui/screens/welcome_screen.dart';
import 'ui/screens/login_screen.dart';

class AppRoutes {
  static const String dashboard = '/dashboard';
  static const String login = '/login';
  static const String rateInterest = '/rate_interest';
  static const String register = '/register';
  static const String simpleInterest = '/simple_interest';
  static const String welcome = '/';

  static Map<String, WidgetBuilder> getRoutes() {
    return {
      dashboard: (context) => const DashboardScreen(),
      login: (context) => const LoginScreen(),
      rateInterest: (context) => const RateInterestScreen(),
      register: (context) => const RegisterScreen(),
      simpleInterest: (context) => const SimpleInterestScreen(),
      welcome: (context) => const WelcomeScreen(),
    };
  }
}
