import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';

class RateInterestScreen extends StatefulWidget {
  const RateInterestScreen({super.key});

  @override
  State<RateInterestScreen> createState() => _RateInterestScreenState();
}

class _RateInterestScreenState extends State<RateInterestScreen> {
  int _selectedOption = 0;

  final List<String> formulas = [
    r'i = \frac{(M - C)}{(C \cdot t)} \cdot 100',
    r'i = \left( \frac{M}{C} \right)^{\frac{1}{t}} - 1 \cdot 100',
    r'i = ...',
  ];

  final List<String> titles = [
    'Tasa de Interés Simple',
    'Tasa de Interés Compuesta',
    'Tasa Nominal/Efectiva',
  ];

  void _onAccept() {
    switch (_selectedOption) {
      case 0:
        Navigator.pushNamed(context, '/simple-rate-interest');
        break;
      case 1:
        Navigator.pushNamed(context, '/compound-rate-interest');
        break;
      case 2:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Esta opción estará disponible en futuras versiones.',
            ),
          ),
        );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Selecciona el Tipo de Tasa"),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "¿Qué tipo de tasa de interés deseas calcular?",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: titles.length,
                itemBuilder:
                    (context, index) => Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: RadioListTile<int>(
                        value: index,
                        groupValue: _selectedOption,
                        onChanged: (value) {
                          setState(() {
                            _selectedOption = value!;
                          });
                        },
                        title: Text(titles[index]),
                        subtitle: Math.tex(
                          formulas[index],
                          textStyle: const TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                      ),
                    ),
              ),
            ),
            ElevatedButton(
              onPressed: _onAccept,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 50,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
              ),
              child: const Text("Aceptar"),
            ),
          ],
        ),
      ),
    );
  }
}
