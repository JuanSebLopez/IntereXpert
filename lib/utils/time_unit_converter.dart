class TimeUnitConverter {
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
