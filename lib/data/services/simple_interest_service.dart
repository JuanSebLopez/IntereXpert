import 'dart:math';

class SimpleInterestResult {
  final String variableCalculated;
  final double value;

  SimpleInterestResult({required this.variableCalculated, required this.value});
}

class SimpleInterestService {
  static SimpleInterestResult calculate({
    double? interest,
    double? rate,
    double? capital,
    double? time,
    required String unitInput,
    required String unitForCalculation,
  }) {
    print("--- Datos recibidos ---");
    print("Interest: $interest, Rate: $rate, Capital: $capital, Time: $time");
    print("Unidad de Tiempo Fijo: $unitInput");
    print("Unidad para el Cálculo: $unitForCalculation");

    int emptyFields =
        [interest, rate, capital, time].where((value) => value == null).length;

    if (emptyFields != 1) {
      throw ArgumentError(
        'Debe dejar exactamente un campo vacío para calcular.',
      );
    }

    // Convertir el tiempo si es necesario
    double convertedTime = 0;
    if (time != null) {
      convertedTime = _convertirTiempo(time, unitInput, unitForCalculation);
    }

    print("Tiempo convertido: $convertedTime");

    // Cálculo de Interés (I)
    if (interest == null) {
      if (capital! <= 0 || rate! <= 0 || convertedTime <= 0) {
        throw ArgumentError(
          'Los valores de capital, tasa y tiempo deben ser mayores a cero.',
        );
      }
      double result = _formatNumber(capital * rate * convertedTime);
      print("Cálculo de Interés: $result");
      return SimpleInterestResult(variableCalculated: 'I', value: result);
    }

    // Cálculo de Tasa de Interés (i)
    if (rate == null) {
      if (interest <= 0 || capital! <= 0 || convertedTime <= 0) {
        throw ArgumentError(
          'Los valores de interés, capital y tiempo deben ser mayores a cero.',
        );
      }
      double result = _formatNumber(interest / (capital * convertedTime));
      print("Cálculo de Tasa: $result");
      return SimpleInterestResult(variableCalculated: 'i', value: result);
    }

    // Cálculo de Capital (C)
    if (capital == null) {
      if (interest <= 0 || rate! <= 0 || convertedTime <= 0) {
        throw ArgumentError(
          'Los valores de interés, tasa y tiempo deben ser mayores a cero.',
        );
      }
      double result = _formatNumber(interest / (rate * convertedTime));
      print("Cálculo de Capital: $result");
      return SimpleInterestResult(variableCalculated: 'C', value: result);
    }

    // Cálculo de Tiempo (t)
    if (time == null) {
      if (interest! <= 0 || capital! <= 0 || rate! <= 0) {
        throw ArgumentError(
          'Los valores de interés, capital y tasa deben ser mayores a cero.',
        );
      }
      double result = _formatNumber(interest / (capital * rate));
      print("Cálculo de Tiempo: $result");
      return SimpleInterestResult(variableCalculated: 't', value: result);
    }

    throw ArgumentError('Datos inválidos para el cálculo.');
  }

  // Función para convertir el tiempo entre unidades
  static double _convertirTiempo(
    double tiempo,
    String unidadOrigen,
    String unidadDestino,
  ) {
    final Map<String, double> diasPorUnidad = {
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

    if (!diasPorUnidad.containsKey(unidadOrigen.toLowerCase()) ||
        !diasPorUnidad.containsKey(unidadDestino.toLowerCase())) {
      throw ArgumentError('Unidad de tiempo no reconocida.');
    }

    // Convertir tiempo de la unidad origen a días y luego de días a la unidad destino
    double tiempoEnDias = tiempo * diasPorUnidad[unidadOrigen.toLowerCase()]!;
    double tiempoConvertido =
        tiempoEnDias / diasPorUnidad[unidadDestino.toLowerCase()]!;

    return _formatNumber(tiempoConvertido);
  }

  // Redondeo y eliminación de ceros innecesarios
  static double _formatNumber(double number) {
    return number == number.roundToDouble()
        ? number.roundToDouble()
        : double.parse(number.toStringAsFixed(4));
  }
}
