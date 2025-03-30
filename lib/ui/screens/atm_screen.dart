import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../data/account_model.dart';
import '../../data/withdrawal_service.dart';

class ATMScreen extends StatefulWidget {
  const ATMScreen({super.key});

  @override
  State<ATMScreen> createState() => _ATMScreenState();
}

class _ATMScreenState extends State<ATMScreen> {
  final List<int> fixedAmounts = [50000, 100000, 200000, 500000];
  final TextEditingController _accountController = TextEditingController();
  final TextEditingController _keyController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();

  AccountType _selectedType = AccountType.nequi;
  String? _temporaryKey;
  DateTime? _temporaryKeyExpiry;
  bool _isKeyVisible = false;
  bool _isProcessing = false;
  String? _errorMessage;
  Map<int, int>? _bills;
  int? _possibleWithdrawals;

  @override
  void dispose() {
    _accountController.dispose();
    _keyController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  void _generateTemporaryKey() {
    setState(() {
      _temporaryKey = WithdrawalService.generateTemporaryKey();
      _temporaryKeyExpiry = DateTime.now().add(const Duration(seconds: 60));
      _isKeyVisible = true;
    });

    Future.delayed(const Duration(seconds: 60), () {
      if (mounted) {
        setState(() {
          _isKeyVisible = false;
          _temporaryKey = null;
          _temporaryKeyExpiry = null;
        });
      }
    });
  }

  void _processWithdrawal() {
    setState(() {
      _isProcessing = true;
      _errorMessage = null;
      _bills = null;
    });

    try {
      final amount = int.parse(_amountController.text);
      if (!WithdrawalService.isValidAmount(amount)) {
        throw Exception(
          'El monto debe ser múltiplo de 1000 y no puede ser múltiplo de 5000',
        );
      }

      _bills = WithdrawalService.calculateBills(amount);
      _possibleWithdrawals = WithdrawalService.predictPossibleWithdrawals(
        1000000,
      ); // Ejemplo con 1M de saldo
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ATM'),
        backgroundColor: const Color(0xFF28a745),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Tipo de Cuenta',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<AccountType>(
                      value: _selectedType,
                      items:
                          AccountType.values.map((type) {
                            return DropdownMenuItem(
                              value: type,
                              child: Text(type.toString().split('.').last),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedType = value!;
                          _accountController.clear();
                          _keyController.clear();
                          _amountController.clear();
                        });
                      },
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Datos de la Cuenta',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _accountController,
                      decoration: InputDecoration(
                        labelText:
                            _selectedType == AccountType.nequi
                                ? 'Número de Celular (10 dígitos)'
                                : 'Número de Cuenta (11 dígitos)',
                        border: const OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    ),
                    if (_selectedType == AccountType.nequi) ...[
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: _generateTemporaryKey,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF28a745),
                        ),
                        child: const Text('Generar Clave Temporal'),
                      ),
                      if (_isKeyVisible && _temporaryKey != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Clave Temporal: $_temporaryKey',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Expira en: ${_temporaryKeyExpiry?.difference(DateTime.now()).inSeconds ?? 0} segundos',
                          style: const TextStyle(color: Colors.red),
                        ),
                      ],
                    ] else ...[
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _keyController,
                        decoration: const InputDecoration(
                          labelText: 'Clave de 4 dígitos',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        obscureText: true,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(4),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Monto a Retirar',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        ...fixedAmounts.map(
                          (amount) => ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _amountController.text = amount.toString();
                              });
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF28a745),
                            ),
                            child: Text('\$${amount.toStringAsFixed(0)}'),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder:
                                  (context) => AlertDialog(
                                    title: const Text('Otro Monto'),
                                    content: TextField(
                                      controller: _amountController,
                                      keyboardType: TextInputType.number,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.digitsOnly,
                                      ],
                                      decoration: const InputDecoration(
                                        labelText: 'Ingrese el monto',
                                        border: OutlineInputBorder(),
                                      ),
                                    ),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(context),
                                        child: const Text('Cancelar'),
                                      ),
                                      TextButton(
                                        onPressed: () => Navigator.pop(context),
                                        child: const Text('Aceptar'),
                                      ),
                                    ],
                                  ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF28a745),
                          ),
                          child: const Text('Otro'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _amountController,
                      decoration: const InputDecoration(
                        labelText: 'Monto',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isProcessing ? null : _processWithdrawal,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF28a745),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child:
                        _isProcessing
                            ? const CircularProgressIndicator(
                              color: Colors.white,
                            )
                            : const Text('Procesar Retiro'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _accountController.clear();
                        _keyController.clear();
                        _amountController.clear();
                        _errorMessage = null;
                        _bills = null;
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFFD700),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('Borrar'),
                  ),
                ),
              ],
            ),
            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Card(
                color: Colors.red[100],
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              ),
            ],
            if (_bills != null) ...[
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        WithdrawalService.formatBills(_bills!),
                        style: const TextStyle(fontSize: 16),
                      ),
                      if (_possibleWithdrawals != null) ...[
                        const SizedBox(height: 8),
                        Text(
                          'Retiros posibles: $_possibleWithdrawals',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
