import 'package:flutter/material.dart';
import 'package:interesxpert/ui/screens/annuity_screen.dart';
import 'package:interesxpert/ui/screens/compound_interest_screen.dart';
import 'package:interesxpert/ui/screens/compound_rate_interest_calculation_screen.dart';
import 'package:interesxpert/ui/screens/dashboard_screen.dart';
import 'package:interesxpert/ui/screens/rate_interest_screen.dart';
import 'package:interesxpert/ui/screens/register_screen.dart';
import 'package:interesxpert/ui/screens/simple_interest_screen.dart';
import 'package:interesxpert/ui/screens/simple_rate_interest_calculation_screen.dart';
import 'package:interesxpert/ui/screens/atm_screen.dart';
import 'ui/screens/welcome_screen.dart';
import 'ui/screens/login_screen.dart';

class AppRoutes {
  static const String annuity = '/annuity';
  static const String compoundInterest = '/compound-interest';
  static const String compoundRateInterest = '/compound-rate-interest';
  static const String dashboard = '/dashboard';
  static const String login = '/login';
  static const String rateInterest = '/rate-interest';
  static const String register = '/register';
  static const String simpleInterest = '/simple-interest';
  static const String simpleRateInterest = '/simple-rate-interest';
  static const String welcome = '/';
  static const String atm = '/atm';

  static Map<String, WidgetBuilder> getRoutes() {
    return {
      annuity: (context) => const AnnuityScreen(),
      compoundInterest: (context) => const CompoundInterestScreen(),
      compoundRateInterest:
          (context) => const CompoundRateInterestCalculationScreen(),
      dashboard: (context) => const DashboardScreen(),
      login: (context) => const LoginScreen(),
      rateInterest: (context) => const RateInterestScreen(),
      register: (context) => const RegisterScreen(),
      simpleInterest: (context) => const SimpleInterestScreen(),
      simpleRateInterest:
          (context) => const SimpleRateInterestCalculationScreen(),
      welcome: (context) => const WelcomeScreen(),
      atm: (context) => const ATMScreen(),
    };
  }
}
