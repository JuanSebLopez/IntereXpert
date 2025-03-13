import 'package:flutter/material.dart';
import 'package:interesxpert/data/services/rate_interest_calculation_service.dart';
import '../widgets/time_input.dart';

class CompoundRateInterestCalculationScreen extends StatefulWidget {
  const CompoundRateInterestCalculationScreen({super.key});

  @override
  State<CompoundRateInterestCalculationScreen> createState() =>
      _CompoundRateInterestCalculationScreenState();
}

class _CompoundRateInterestCalculationScreenState
    extends State<CompoundRateInterestCalculationScreen> {
  final TextEditingController _montoController = TextEditingController();
  final TextEditingController _capitalController = TextEditingController();

  double? _fixedTime;
  double? _calculatedTime;
  String? _unitTimeInput;
  String? _unitTimeCalculation;
  String? _result;

  void _calcularTasa() {
    try {
      double monto = double.parse(_montoController.text);
      double capital = double.parse(_capitalController.text);
      double tiempo = _fixedTime ?? _calculatedTime ?? 0;

      double tasa =
          RateInterestCalculationService.compoundRateInterestCalculation(
            monto: monto,
            capital: capital,
            tiempo: tiempo,
            unidadTiempo: _unitTimeInput!,
            unidadEcuacion: _unitTimeCalculation!,
          );

      setState(() {
        _result = 'Tasa de interés compuesta: $tasa%';
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
        title: const Text("Tasa de Interés Compuesto"),
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
              onFixedTimeChanged: (time, unit) {
                setState(() {
                  _fixedTime = time.toDouble();
                  _unitTimeInput = unit;
                });
              },
              onCalculatedTimeChanged: (startDate, endDate) {
                setState(() {
                  _calculatedTime =
                      endDate.difference(startDate).inDays.toDouble();
                  _unitTimeInput = 'Días';
                });
              },
              onUnitForCalculationChanged: (unit) {
                setState(() {
                  _unitTimeCalculation = unit;
                });
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
