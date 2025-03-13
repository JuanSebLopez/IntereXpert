import 'package:flutter/material.dart';
import '../../data/services/simple_rate_interest_calculation_service.dart';
import '../widgets/time_input.dart';

class SimpleRateInterestCalculationScreen extends StatefulWidget {
  const SimpleRateInterestCalculationScreen({super.key});

  @override
  State<SimpleRateInterestCalculationScreen> createState() =>
      _SimpleRateInterestCalculationScreenState();
}

class _SimpleRateInterestCalculationScreenState
    extends State<SimpleRateInterestCalculationScreen> {
  final TextEditingController _montoController = TextEditingController();
  final TextEditingController _capitalController = TextEditingController();

  double? _fixedTime;
  double? _calculatedTime;
  String? _unitInput;
  String? _unitForCalculation;
  String? _result;

  void _calcularTasa() {
    try {
      double monto = double.parse(_montoController.text);
      double capital = double.parse(_capitalController.text);
      double tiempo = _fixedTime ?? _calculatedTime ?? 0;

      if (tiempo <= 0 || _unitInput == null || _unitForCalculation == null) {
        throw Exception('Datos de tiempo inválidos.');
      }

      double tasa =
          SimpleRateInterestCalculationService.simpleRateInterestCalculation(
            monto: monto,
            capital: capital,
            tiempo: tiempo,
            unidadTiempo: _unitInput!,
            unidadEcuacion: _unitForCalculation!,
          );

      setState(() {
        _result = 'Tasa de interés: $tasa%';
      });
    } catch (e) {
      setState(() {
        _result = "Error en los datos ingresados.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Cálculo de Tasa de Interés Simple"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              "Ingrese los valores para calcular:",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _montoController,
              decoration: const InputDecoration(
                labelText: "Monto (M)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _capitalController,
              decoration: const InputDecoration(
                labelText: "Capital (C)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TimeInputWidget(
              onFixedTimeChanged: (time, inputUnit) {
                setState(() {
                  _fixedTime = time.toDouble();
                  _unitInput = inputUnit;
                });
              },
              onCalculatedTimeChanged: (startDate, endDate) {
                setState(() {
                  _calculatedTime =
                      endDate.difference(startDate).inDays.toDouble();
                  _unitInput = 'Días';
                });
              },
              onUnitForCalculationChanged: (unit) {
                _unitForCalculation = unit;
              },
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _calcularTasa,
              child: const Text("Calcular"),
            ),
            const SizedBox(height: 24),
            if (_result != null)
              Text(
                _result!,
                style: const TextStyle(
                  fontSize: 18,
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
