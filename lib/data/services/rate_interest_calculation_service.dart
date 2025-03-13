import 'dart:math';

class RateInterestCalculationService {
  static double simpleRateInterestCalculation({
    required double monto,
    required double capital,
    required double tiempo,
    required String unidadTiempo,
    required String unidadEcuacion,
  }) {
    if (capital <= 0 || tiempo <= 0 || monto <= 0) {
      throw ArgumentError(
        'Los valores de monto, capital y tiempo deben ser mayores a cero.',
      );
    }

    // Convertir el tiempo a la unidad seleccionada
    double tiempoConvertido = _convertirTiempo(
      tiempo,
      unidadTiempo,
      unidadEcuacion,
    );

    double tasa = ((monto - capital) / (capital * tiempoConvertido)) * 100;
    return double.parse(tasa.toStringAsFixed(4));
  }

  static double compoundRateInterestCalculation({
    required double monto,
    required double capital,
    required double tiempo,
    required String unidadTiempo,
    required String unidadEcuacion,
  }) {
    if (capital <= 0 || tiempo <= 0 || monto <= 0) {
      throw ArgumentError(
        'Los valores de monto, capital y tiempo deben ser mayores a cero.',
      );
    }

    // Convertir el tiempo a la unidad seleccionada
    double tiempoConvertido = _convertirTiempo(
      tiempo,
      unidadTiempo,
      unidadEcuacion,
    );

    double tasa = (pow((monto / capital), (1 / tiempoConvertido)) - 1) * 100;
    return double.parse(tasa.toStringAsFixed(4));
  }

  static double _convertirTiempo(
    double tiempo,
    String unidadOrigen,
    String unidadDestino,
  ) {
    double tiempoEnDias = _convertirTiempoADias(tiempo, unidadOrigen);
    return _convertirDiasATiempo(tiempoEnDias, unidadDestino);
  }

  static double _convertirTiempoADias(double tiempo, String unidadTiempo) {
    switch (unidadTiempo.toLowerCase()) {
      case 'segundos':
        return tiempo / (24 * 60 * 60);
      case 'minutos':
        return tiempo / (24 * 60);
      case 'horas':
        return tiempo / 24;
      case 'días':
        return tiempo;
      case 'semanas':
        return tiempo * 7;
      case 'mensual':
        return tiempo * 30;
      case 'bimestral':
        return tiempo * 60;
      case 'trimestral':
        return tiempo * 90;
      case 'cuatrimestral':
        return tiempo * 120;
      case 'semestral':
        return tiempo * 180;
      case 'anual':
        return tiempo * 365;
      default:
        throw ArgumentError('Unidad de tiempo no reconocida.');
    }
  }

  static double _convertirDiasATiempo(double dias, String unidadTiempo) {
    switch (unidadTiempo.toLowerCase()) {
      case 'segundos':
        return dias * 24 * 60 * 60;
      case 'minutos':
        return dias * 24 * 60;
      case 'horas':
        return dias * 24;
      case 'días':
        return dias;
      case 'semanas':
        return dias / 7;
      case 'mensual':
        return dias / 30;
      case 'bimestral':
        return dias / 60;
      case 'trimestral':
        return dias / 90;
      case 'cuatrimestral':
        return dias / 120;
      case 'semestral':
        return dias / 180;
      case 'anual':
        return dias / 365.25;
      default:
        throw ArgumentError('Unidad de tiempo no reconocida.');
    }
  }
}
