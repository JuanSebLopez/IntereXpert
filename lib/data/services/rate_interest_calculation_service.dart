import 'dart:math';
import '../../utils/time_unit_converter.dart';

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
    double tiempoConvertido = TimeUnitConverter.convertirTiempo(
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
    double tiempoConvertido = TimeUnitConverter.convertirTiempo(
      tiempo,
      unidadTiempo,
      unidadEcuacion,
    );

    double tasa = (pow((monto / capital), (1 / tiempoConvertido)) - 1) * 100;
    return double.parse(tasa.toStringAsFixed(4));
  }
}
