import 'package:flutter/material.dart';
import 'package:interesxpert/routes.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo parte superior
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Image.asset('assets/logo_home.png', height: 120),
            ),
            SizedBox(height: 40),

            // Texto bienvenida
            Text(
              "Bienvenido",
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),

            Text(
              "Crea una cuenta y accede a nuestro increíble servicio",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            SizedBox(height: 40),

            // Botón de inicio
            ElevatedButton(
              onPressed: () {
                // Navegar al login
                Navigator.pushNamed(context, '/login');
              },
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: Text("Empecemos", style: TextStyle(fontSize: 18)),
            ),
            SizedBox(height: 20),

            // Link para iniciar sesión
            GestureDetector(
              onTap: () {
                Navigator.pushNamed(context, AppRoutes.register);
              },
              child: Text(
                "¿No tienes una cuenta?",
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.blue,
                  decoration: TextDecoration.underline,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
