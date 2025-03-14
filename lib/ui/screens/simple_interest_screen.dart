import 'package:flutter/material.dart';
import 'package:interesxpert/data/services/simple_interest_service.dart';

class SimpleInterestScreen extends StatefulWidget {
  const SimpleInterestScreen({super.key});

  @override
  State<SimpleInterestScreen> createState() => _SimpleInterestScreenState();
}

class _SimpleInterestScreenState extends State<SimpleInterestScreen> {
  final TextEditingController _interestController = TextEditingController();
  final TextEditingController _rateController = TextEditingController();
  final TextEditingController _capitalController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();

  String _unitInput = 'Mensual';
  String _unitForCalculation = 'Mensual';

  String? _result;
  String? _error;

  final List<String> _timeUnits = [
    'Segundos',
    'Minutos',
    'Horas',
    'Días',
    'Semanas',
    'Mensual',
    'Bimestral',
    'Trimestral',
    'Cuatrimestral',
    'Semestral',
    'Anual',
  ];

  void _calculate() {
    setState(() {
      _result = null;
      _error = null;
    });

    try {
      double? interest =
          _interestController.text.isNotEmpty
              ? double.tryParse(_interestController.text)
              : null;
      double? rate =
          _rateController.text.isNotEmpty
              ? double.tryParse(_rateController.text)
              : null;
      double? capital =
          _capitalController.text.isNotEmpty
              ? double.tryParse(_capitalController.text)
              : null;
      double? time =
          _timeController.text.isNotEmpty
              ? double.tryParse(_timeController.text)
              : null;

      final result = SimpleInterestService.calculate(
        interest: interest,
        rate: rate,
        capital: capital,
        time: time,
        unitInput: time != null ? _unitInput : 'Mensual',
        unitForCalculation: _unitForCalculation,
      );

      String displayResult = result.value.toString();
      String unit = "";

      switch (result.variableCalculated) {
        case 'I':
        case 'C':
          displayResult = "\$${displayResult}";
          break;
        case 'i':
          displayResult = "${displayResult}%";
          break;
        case 't':
          displayResult = "$displayResult $_unitForCalculation";
          break;
      }

      setState(() {
        _result = "${result.variableCalculated} = $displayResult";
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Interés Simple"), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              "Ingrese los valores:",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _interestController,
              decoration: const InputDecoration(
                labelText: "Interés (I)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _rateController,
              decoration: const InputDecoration(
                labelText: "Tasa de Interés (i - Décimal)",
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
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: "Unidad para el cálculo",
                border: OutlineInputBorder(),
              ),
              value: _unitForCalculation,
              items:
                  _timeUnits.map((unit) {
                    return DropdownMenuItem(value: unit, child: Text(unit));
                  }).toList(),
              onChanged: (value) {
                setState(() {
                  _unitForCalculation = value!;
                });
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: "Unidad del tiempo fijo",
                border: OutlineInputBorder(),
              ),
              value: _unitInput,
              items:
                  _timeUnits.map((unit) {
                    return DropdownMenuItem(value: unit, child: Text(unit));
                  }).toList(),
              onChanged: (value) {
                setState(() {
                  _unitInput = value!;
                });
              },
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _timeController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Cantidad de tiempo',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _calculate,
              child: const Text("Calcular"),
            ),
            const SizedBox(height: 24),
            if (_result != null)
              Align(
                alignment: Alignment.center,
                child: Text(
                  _result!,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            if (_error != null)
              Text(
                _error!,
                style: const TextStyle(color: Colors.red, fontSize: 16),
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }
}
