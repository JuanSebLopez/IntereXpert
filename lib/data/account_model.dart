enum AccountType { nequi, ahorroMano, cuentaAhorros }

class Account {
  final String accountNumber;
  final AccountType type;
  String? temporaryKey; // Solo para NEQUI
  DateTime? temporaryKeyExpiry; // Solo para NEQUI

  Account({
    required this.accountNumber,
    required this.type,
    this.temporaryKey,
    this.temporaryKeyExpiry,
  });

  bool isValid() {
    switch (type) {
      case AccountType.nequi:
        return accountNumber.length == 10 &&
            int.tryParse(accountNumber) != null;
      case AccountType.ahorroMano:
        return accountNumber.length == 11 &&
            int.tryParse(accountNumber) != null &&
            accountNumber[0] == '0' &&
            accountNumber[1] == '3';
      case AccountType.cuentaAhorros:
        return accountNumber.length == 11 &&
            int.tryParse(accountNumber) != null;
    }
  }

  String getFormattedNumber() {
    switch (type) {
      case AccountType.nequi:
        return '0$accountNumber';
      default:
        return accountNumber;
    }
  }
}
