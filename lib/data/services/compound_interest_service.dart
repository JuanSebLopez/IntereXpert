import 'dart:math';

class CompoundInterestResult {
  final String variableCalculated;
  final double value;

  CompoundInterestResult({
    required this.variableCalculated,
    required this.value,
  });
}

class CompoundInterestService {
  static CompoundInterestResult calculate({
    double? montoCompuesto,
    double? capital,
    double? rate,
    double? time,
    required String unitInput,
    required String unitForCalculation,
  }) {
    print("--- Datos recibidos ---");
    print(
      "Monto Compuesto: $montoCompuesto, Capital: $capital, Rate: $rate, Time: $time",
    );
    print("Unidad de Tiempo Fijo: $unitInput");
    print("Unidad para el Cálculo: $unitForCalculation");

    int emptyFields =
        [
          montoCompuesto,
          capital,
          rate,
          time,
        ].where((value) => value == null).length;

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

    // Cálculo del Monto Compuesto (MC)
    if (montoCompuesto == null) {
      double result = _formatNumber(capital! * pow(1 + rate!, convertedTime));
      print("Cálculo de Monto Compuesto: $result");
      return CompoundInterestResult(variableCalculated: 'MC', value: result);
    }

    // Cálculo del Capital (C)
    if (capital == null) {
      double result = _formatNumber(
        montoCompuesto / pow(1 + rate!, convertedTime),
      );
      print("Cálculo de Capital: $result");
      return CompoundInterestResult(variableCalculated: 'C', value: result);
    }

    // Cálculo de la Tasa de Interés (i)
    if (rate == null) {
      double result = _formatNumber(
        pow(montoCompuesto! / capital!, 1 / convertedTime) - 1,
      );
      print("Cálculo de Tasa de Interés: $result");
      return CompoundInterestResult(variableCalculated: 'i', value: result);
    }

    // Cálculo del Tiempo (t)
    if (time == null) {
      double result = _formatNumber(
        log(montoCompuesto! / capital!) / log(1 + rate!),
      );
      print("Cálculo de Tiempo: $result");
      return CompoundInterestResult(variableCalculated: 't', value: result);
    }

    throw ArgumentError('Datos inválidos para el cálculo.');
  }

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

    double tiempoEnDias = tiempo * diasPorUnidad[unidadOrigen.toLowerCase()]!;
    double tiempoConvertido =
        tiempoEnDias / diasPorUnidad[unidadDestino.toLowerCase()]!;

    return _formatNumber(tiempoConvertido);
  }

  static double _formatNumber(double number) {
    return number == number.roundToDouble()
        ? number.roundToDouble()
        : double.parse(number.toStringAsFixed(4));
  }
}
