class TimeUnitConverter {
  static const double _diasPorAno = 365.0;
  static const double _diasPorMes = 30.0;
  static const double _diasPorSemana = 7.0;

  static double convertirTiempo(
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
        return tiempo * _diasPorSemana;
      case 'mensual':
        return tiempo * _diasPorMes;
      case 'bimestral':
        return tiempo * (_diasPorMes * 2);
      case 'trimestral':
        return tiempo * (_diasPorMes * 3);
      case 'cuatrimestral':
        return tiempo * (_diasPorMes * 4);
      case 'semestral':
        return tiempo * (_diasPorMes * 6);
      case 'anual':
        return tiempo * _diasPorAno;
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
        return dias / _diasPorSemana;
      case 'mensual':
        return dias / _diasPorMes;
      case 'bimestral':
        return dias / (_diasPorMes * 2);
      case 'trimestral':
        return dias / (_diasPorMes * 3);
      case 'cuatrimestral':
        return dias / (_diasPorMes * 4);
      case 'semestral':
        return dias / (_diasPorMes * 6);
      case 'anual':
        return dias / _diasPorAno;
      default:
        throw ArgumentError('Unidad de tiempo no reconocida.');
    }
  }
}
