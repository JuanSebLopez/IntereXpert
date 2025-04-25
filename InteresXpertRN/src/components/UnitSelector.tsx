import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

export type TimeUnit = 
  | 'anual' 
  | 'semestral' 
  | 'cuatrimestral' 
  | 'trimestral' 
  | 'bimestral' 
  | 'mensual'
  | 'semanal'
  | 'diario'
  | 'horas'
  | 'minutos'
  | 'segundos';

export const timeUnits: TimeUnit[] = [
  'anual',
  'semestral',
  'cuatrimestral',
  'trimestral',
  'bimestral',
  'mensual',
  'semanal',
  'diario',
  'horas',
  'minutos',
  'segundos'
];

// Factores de conversión para normalizar a base anual
export const timeUnitFactors: Record<TimeUnit, number> = {
  anual: 1,
  semestral: 2,
  cuatrimestral: 3,
  trimestral: 4,
  bimestral: 6,
  mensual: 12,
  semanal: 52.1429,
  diario: 365,
  horas: 8760,
  minutos: 525600,
  segundos: 31536000
};

interface UnitSelectorProps {
  label: string;
  selectedUnit: TimeUnit;
  onUnitChange: (unit: TimeUnit) => void;
  accentColor: string;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({
  label,
  selectedUnit,
  onUnitChange,
  accentColor
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const selectUnit = (unit: TimeUnit) => {
    onUnitChange(unit);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.selector, { borderColor: accentColor }]} 
        onPress={openModal}
      >
        <Text style={[styles.selectedText, { color: accentColor }]}>
          {selectedUnit.charAt(0).toUpperCase() + selectedUnit.slice(1)}
        </Text>
        <Text style={[styles.arrow, { color: accentColor }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una unidad</Text>
            <FlatList
              data={timeUnits}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.unitItem,
                    selectedUnit === item && { backgroundColor: `${accentColor}20` }
                  ]}
                  onPress={() => selectUnit(item)}
                >
                  <Text 
                    style={[
                      styles.unitText,
                      selectedUnit === item && { color: accentColor, fontWeight: 'bold' }
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  selector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  unitItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 6,
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UnitSelector; 