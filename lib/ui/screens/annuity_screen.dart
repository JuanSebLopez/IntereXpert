import 'package:flutter/material.dart';
import 'package:interesxpert/data/services/annuity_service.dart';

class AnnuityScreen extends StatefulWidget {
  const AnnuityScreen({super.key});

  @override
  State<AnnuityScreen> createState() => _AnnuityScreenState();
}

class _AnnuityScreenState extends State<AnnuityScreen> {
  final TextEditingController _valorFuturoController = TextEditingController();
  final TextEditingController _valorPresenteController =
      TextEditingController();
  final TextEditingController _rentaController = TextEditingController();
  final TextEditingController _rateController = TextEditingController();
  final TextEditingController _timeController = TextEditingController();

  String _unitInput = 'Mensual';
  String _unitForCalculation = 'Mensual';
  bool _isAnticipada = false;
  String _calculationTarget = 'None'; // Agregando None por defecto

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

  final List<String> _calculationOptions = ['None', 'VF', 'VP'];

  void _calculate() {
    setState(() {
      _result = null;
      _error = null;
    });

    try {
      double? valorFuturo =
          _valorFuturoController.text.isNotEmpty
              ? double.tryParse(_valorFuturoController.text)
              : null;
      double? valorPresente =
          _valorPresenteController.text.isNotEmpty
              ? double.tryParse(_valorPresenteController.text)
              : null;
      double? renta =
          _rentaController.text.isNotEmpty
              ? double.tryParse(_rentaController.text)
              : null;
      double? rate =
          _rateController.text.isNotEmpty
              ? double.tryParse(_rateController.text)
              : null;
      double? time =
          _timeController.text.isNotEmpty
              ? double.tryParse(_timeController.text)
              : null;

      final result = AnnuityService.calculate(
        valorFuturo: _calculationTarget == 'VF' ? null : valorFuturo,
        valorPresente: _calculationTarget == 'VP' ? null : valorPresente,
        renta: renta,
        rate: rate,
        time: time,
        esAnticipada: _isAnticipada,
        calculationTarget: _calculationTarget,
        unitInput: time != null ? _unitInput : 'Mensual',
        unitForCalculation: _unitForCalculation,
      );

      String displayResult = result.value.toString();

      switch (result.variableCalculated) {
        case 'VF':
        case 'VP':
        case 'R':
          displayResult = "\$${displayResult}";
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
      appBar: AppBar(title: const Text("Anualidades"), centerTitle: true),
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
              controller: _valorFuturoController,
              decoration: const InputDecoration(
                labelText: "Valor Futuro (VF)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _valorPresenteController,
              decoration: const InputDecoration(
                labelText: "Valor Presente (VP)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _rentaController,
              decoration: const InputDecoration(
                labelText: "Renta (R)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _rateController,
              decoration: const InputDecoration(
                labelText: "Tasa de Interés (i - Decimal)",
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _timeController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Cantidad de tiempo (t)',
                border: OutlineInputBorder(),
              ),
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
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: "¿Qué desea calcular?",
                border: OutlineInputBorder(),
              ),
              value: _calculationTarget,
              items:
                  _calculationOptions.map((option) {
                    return DropdownMenuItem(value: option, child: Text(option));
                  }).toList(),
              onChanged: (value) {
                setState(() {
                  _calculationTarget = value!;
                });
              },
            ),
            const SizedBox(height: 16),
            CheckboxListTile(
              title: const Text("¿Es Anualidad Anticipada?"),
              value: _isAnticipada,
              onChanged: (bool? value) {
                setState(() {
                  _isAnticipada = value!;
                });
              },
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
