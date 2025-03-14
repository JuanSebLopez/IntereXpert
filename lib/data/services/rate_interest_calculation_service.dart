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

    double tiempoConvertido = tiempo;

    // Convertir el tiempo solo si las unidades son diferentes
    if (unidadTiempo != unidadEcuacion) {
      tiempoConvertido = _convertirTiempo(tiempo, unidadTiempo, unidadEcuacion);
    }

    if (tiempoConvertido <= 0) {
      throw ArgumentError(
        'El tiempo convertido no puede ser menor o igual a cero.',
      );
    }

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

    double tiempoConvertido = tiempo;

    // Convertir el tiempo solo si las unidades son diferentes
    if (unidadTiempo != unidadEcuacion) {
      tiempoConvertido = _convertirTiempo(tiempo, unidadTiempo, unidadEcuacion);
    }

    if (tiempoConvertido <= 0) {
      throw ArgumentError(
        'El tiempo convertido no puede ser menor o igual a cero.',
      );
    }

    double tasa = (pow((monto / capital), (1 / tiempoConvertido)) - 1) * 100;
    return double.parse(tasa.toStringAsFixed(4));
  }

  // Conversión personalizada sin utilizar TimeUnitConverter
  static double _convertirTiempo(
    double tiempo,
    String unidadOrigen,
    String unidadDestino,
  ) {
    const Map<String, double> conversionADias = {
      'segundos': 1 / (24 * 60 * 60),
      'minutos': 1 / (24 * 60),
      'horas': 1 / 24,
      'días': 1,
      'semanas': 7,
      'mensual': 30,
      'bimestral': 60,
      'trimestral': 90,
      'cuatrimestral': 120,
      'semestral': 180,
      'anual': 365,
    };

    if (!conversionADias.containsKey(unidadOrigen.toLowerCase()) ||
        !conversionADias.containsKey(unidadDestino.toLowerCase())) {
      throw ArgumentError('Unidad de tiempo no reconocida.');
    }

    // Convertir el tiempo a días y luego a la unidad destino
    double tiempoEnDias = tiempo * conversionADias[unidadOrigen.toLowerCase()]!;
    double tiempoConvertido =
        tiempoEnDias / conversionADias[unidadDestino.toLowerCase()]!;
    return tiempoConvertido;
  }
}
