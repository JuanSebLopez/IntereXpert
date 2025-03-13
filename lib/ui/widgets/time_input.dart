import 'package:flutter/material.dart';

class TimeInputWidget extends StatefulWidget {
  final Function(int, String) onFixedTimeChanged;
  final Function(DateTime start, DateTime end) onCalculatedTimeChanged;
  final Function(String) onUnitForCalculationChanged;

  const TimeInputWidget({
    super.key,
    required this.onFixedTimeChanged,
    required this.onCalculatedTimeChanged,
    required this.onUnitForCalculationChanged,
  });

  @override
  State<TimeInputWidget> createState() => _TimeInputWidgetState();
}

class _TimeInputWidgetState extends State<TimeInputWidget> {
  bool _isFixedTime = true;
  int _fixedTime = 0;
  String _selectedInputUnit = 'Mensual';
  String _selectedCalculationUnit = 'Mensual';

  DateTime? _startDate;
  DateTime? _endDate;

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

  void _selectDate(bool isStartDate) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (pickedDate != null) {
      setState(() {
        if (isStartDate) {
          _startDate = pickedDate;
        } else {
          _endDate = pickedDate;
        }

        if (_startDate != null && _endDate != null) {
          widget.onCalculatedTimeChanged(_startDate!, _endDate!);
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SwitchListTile(
          title: const Text('¿Usar tiempo fijo?'),
          value: _isFixedTime,
          onChanged: (value) {
            setState(() {
              _isFixedTime = value;
            });
          },
        ),
        const SizedBox(height: 10),
        const Text("Unidad para el cálculo"),
        DropdownButton<String>(
          value:
              _timeUnits.contains(_selectedCalculationUnit)
                  ? _selectedCalculationUnit
                  : _timeUnits.first,
          items:
              _timeUnits.map((unit) {
                return DropdownMenuItem(value: unit, child: Text(unit));
              }).toList(),
          onChanged: (value) {
            setState(() {
              _selectedCalculationUnit = value!;
              widget.onUnitForCalculationChanged(value);
            });
          },
        ),
        const SizedBox(height: 10),
        _isFixedTime
            ? Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Unidad del tiempo fijo"),
                DropdownButton<String>(
                  value:
                      _timeUnits.contains(_selectedInputUnit)
                          ? _selectedInputUnit
                          : _timeUnits.first,
                  items:
                      _timeUnits.map((unit) {
                        return DropdownMenuItem(value: unit, child: Text(unit));
                      }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedInputUnit = value!;
                    });
                  },
                ),
                const SizedBox(height: 10),
                TextField(
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Cantidad de tiempo',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (value) {
                    setState(() {
                      _fixedTime = int.tryParse(value) ?? 0;
                      widget.onFixedTimeChanged(_fixedTime, _selectedInputUnit);
                    });
                  },
                ),
              ],
            )
            : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ElevatedButton(
                  onPressed: () => _selectDate(true),
                  child: Text(
                    _startDate == null
                        ? 'Seleccionar fecha de inicio'
                        : 'Inicio: ${_startDate!.toLocal()}'.split(' ')[0],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => _selectDate(false),
                  child: Text(
                    _endDate == null
                        ? 'Seleccionar fecha de fin'
                        : 'Fin: ${_endDate!.toLocal()}'.split(' ')[0],
                  ),
                ),
              ],
            ),
      ],
    );
  }
}
