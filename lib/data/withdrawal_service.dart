import 'dart:math';
import 'package:flutter/material.dart';
import 'account_model.dart';

class WithdrawalService {
  static final List<int> availableBills = [
    100000,
    50000,
    20000,
    10000,
    5000,
    2000,
    1000,
  ];

  static String generateTemporaryKey() {
    final random = Random();
    return List.generate(6, (_) => random.nextInt(10)).join();
  }

  static bool isValidAmount(int amount) {
    return amount % 1000 == 0 && amount % 5000 != 0;
  }

  static Map<int, int> calculateBills(int amount) {
    if (!isValidAmount(amount)) {
      throw Exception('Monto no válido');
    }

    Map<int, int> bills = {};
    int remainingAmount = amount;

    for (int bill in availableBills) {
      if (bill == 5000) continue; // Ignorar billetes de 5000

      int count = remainingAmount ~/ bill;
      if (count > 0) {
        bills[bill] = count;
        remainingAmount -= count * bill;
      }
    }

    if (remainingAmount > 0) {
      throw Exception('No se puede dispensar el monto solicitado');
    }

    return bills;
  }

  static String formatBills(Map<int, int> bills) {
    String result = 'Billetes a dispensar:\n';
    bills.forEach((bill, count) {
      result += '$count billete(s) de \$${bill.toStringAsFixed(0)}\n';
    });
    return result;
  }

  static int predictPossibleWithdrawals(int balance) {
    int count = 0;
    for (int amount = 1000; amount <= balance; amount += 1000) {
      if (isValidAmount(amount)) {
        try {
          calculateBills(amount);
          count++;
        } catch (e) {
          continue;
        }
      }
    }
    return count;
  }
}
