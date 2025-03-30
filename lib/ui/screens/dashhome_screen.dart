import 'package:flutter/material.dart';
import 'package:interesxpert/routes.dart';

class DashhomeScreen extends StatelessWidget {
  const DashhomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('InteresXpert'),
        backgroundColor: const Color(0xFF28a745),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Bienvenido a InteresXpert',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Servicios',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 16,
                      runSpacing: 16,
                      children: [
                        _buildServiceButton(
                          context,
                          'ATM',
                          Icons.atm,
                          AppRoutes.atm,
                          const Color(0xFF28a745),
                        ),
                        _buildServiceButton(
                          context,
                          'Interés Simple',
                          Icons.calculate,
                          AppRoutes.simpleInterest,
                          Colors.blue,
                        ),
                        _buildServiceButton(
                          context,
                          'Interés Compuesto',
                          Icons.functions,
                          AppRoutes.compoundInterest,
                          Colors.orange,
                        ),
                        _buildServiceButton(
                          context,
                          'Anualidades',
                          Icons.timeline,
                          AppRoutes.annuity,
                          Colors.purple,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildServiceButton(
    BuildContext context,
    String label,
    IconData icon,
    String route,
    Color color,
  ) {
    return SizedBox(
      width: 150,
      child: ElevatedButton(
        onPressed: () => Navigator.pushNamed(context, route),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          padding: const EdgeInsets.all(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 32, color: Colors.white),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
