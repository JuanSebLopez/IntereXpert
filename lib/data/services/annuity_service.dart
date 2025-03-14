import 'dart:math';

class AnnuityResult {
  final String variableCalculated;
  final double value;

  AnnuityResult({required this.variableCalculated, required this.value});
}

class AnnuityService {
  static AnnuityResult calculate({
    double? valorFuturo,
    double? valorPresente,
    double? renta,
    double? rate,
    double? time,
    required bool esAnticipada,
    required String calculationTarget,
    required String unitInput,
    required String unitForCalculation,
  }) {
    print("--- Datos recibidos ---");
    print(
      "VF: $valorFuturo, VP: $valorPresente, R: $renta, i: $rate, t: $time",
    );
    print("Anticipada: $esAnticipada");
    print("Unidad de Tiempo Fijo: $unitInput");
    print("Unidad para el Cálculo: $unitForCalculation");

    // Validar que la tasa de interés este presente
    if (rate == null || rate <= 0) {
      throw ArgumentError(
        'La tasa de interés (i) es obligatoria para el cálculo.',
      );
    }

    double convertedTime = 0;
    if (time != null) {
      convertedTime = _convertirTiempo(time, unitInput, unitForCalculation);
    }

    print("Tiempo convertido: $convertedTime");

    // Cálculo de Valor Futuro (VF)
    if (calculationTarget == 'VF') {
      if (renta == null || convertedTime <= 0) {
        throw ArgumentError('Faltan datos para calcular el Valor Futuro.');
      }
      double vf = renta * ((pow(1 + rate, convertedTime) - 1) / rate);
      if (esAnticipada) {
        vf *= (1 + rate);
      }
      print('Valor futuro es: $vf');
      return AnnuityResult(variableCalculated: 'VF', value: _formatNumber(vf));
    }

    // Cálculo Valor Presente (VP)
    if (calculationTarget == 'VP') {
      if (renta == null || convertedTime <= 0) {
        throw ArgumentError('Faltan datos para calcular el Valor Presente.');
      }
      double vp = renta * ((1 - pow(1 + rate, -convertedTime)) / rate);
      if (esAnticipada) {
        vp *= (1 + rate);
      }
      print('Valor Presente es: $vp');
      return AnnuityResult(variableCalculated: 'VP', value: _formatNumber(vp));
    }

    // Si es "None", determinar cuál variable calcular automáticamente

    // Cálculo de Renta (R)
    if (renta == null) {
      if (valorFuturo != null) {
        double r = valorFuturo / ((pow(1 + rate, convertedTime) - 1) / rate);
        if (esAnticipada) {
          r /= (1 + rate);
        }
        print('La renta es $r');
        return AnnuityResult(variableCalculated: 'R', value: _formatNumber(r));
      } else if (valorPresente != null) {
        double r = valorPresente / ((1 - pow(1 + rate, -convertedTime)) / rate);
        if (esAnticipada) {
          r /= (1 + rate);
        }
        print('La renta es $r');
        return AnnuityResult(variableCalculated: 'R', value: _formatNumber(r));
      }
    }

    // Cálculo de Tiempo (t)
    if (time == null) {
      if (valorFuturo != null) {
        double t = log(((valorFuturo * rate) / renta!) + 1) / log(1 + rate);
        print('El tiempo es $t');
        return AnnuityResult(variableCalculated: 't', value: _formatNumber(t));
      } else if (valorPresente != null) {
        double t =
            log(1 - ((valorPresente * rate) / renta!)) / log(1 + rate) * -1;
        print('El tiempo es $t');
        return AnnuityResult(variableCalculated: 't', value: _formatNumber(t));
      }
    }

    throw ArgumentError(
      'No se proporcionaron datos suficientes para el cálculo.',
    );
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
