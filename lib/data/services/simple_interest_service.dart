import '../../utils/time_unit_converter.dart';

class SimpleInterestService {
  static Map<String, dynamic> calcularInteresSimple({
    double? capital,
    double? interes,
    double? tasaInteres,
    double? tiempo,
    String? unidadTiempoInput,
    String? unidadTiempoCalculo,
  }) {
    if (unidadTiempoInput != null &&
        unidadTiempoCalculo != null &&
        tiempo != null) {
      tiempo = TimeUnitConverter.convertirTiempo(
        tiempo,
        unidadTiempoInput,
        unidadTiempoCalculo,
      );
    }

    if (capital == null &&
        interes != null &&
        tasaInteres != null &&
        tiempo != null) {
      double capitalCalculado = interes / (tasaInteres * tiempo);
      return {'variable': 'C', 'value': capitalCalculado.toStringAsFixed(4)};
    } else if (interes == null &&
        capital != null &&
        tasaInteres != null &&
        tiempo != null) {
      double interesCalculado = capital * tasaInteres * tiempo;
      return {'variable': 'I', 'value': interesCalculado.toStringAsFixed(4)};
    } else if (tasaInteres == null &&
        interes != null &&
        capital != null &&
        tiempo != null) {
      double tasaCalculada = interes / (capital * tiempo);
      return {'variable': 'i', 'value': tasaCalculada.toStringAsFixed(4)};
    } else if (tiempo == null &&
        interes != null &&
        capital != null &&
        tasaInteres != null) {
      double tiempoCalculado = interes / (capital * tasaInteres);
      return {'variable': 't', 'value': tiempoCalculado.toStringAsFixed(4)};
    } else {
      throw ArgumentError(
        'Debe dejar exactamente un campo vacío para calcular.',
      );
    }
  }
}
