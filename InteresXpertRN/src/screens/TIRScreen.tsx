import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';

interface CashFlowItem {
  id: string;
  amount: string;
}

const TIRScreen: React.FC = () => {
  const [cashFlows, setCashFlows] = useState<CashFlowItem[]>([
    { id: Date.now().toString() + '0', amount: '' },
    { id: Date.now().toString() + '1', amount: '' },
  ]);
  const [result, setResult] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isApproximate, setIsApproximate] = useState(false);

  const handleFlowChange = (id: string, amount: string) => {
    setCashFlows(currentFlows =>
      currentFlows.map(flow => (flow.id === id ? { ...flow, amount } : flow))
    );
  };

  const addFlow = () => {
    setCashFlows(currentFlows => [
      ...currentFlows,
      { id: Date.now().toString() + currentFlows.length, amount: '' },
    ]);
  };

  const removeFlow = (id: string) => {
    if (cashFlows.length <= 2) {
        Alert.alert("Info", "Se requieren al menos dos flujos de caja.");
        return;
    }
    setCashFlows(currentFlows => currentFlows.filter(flow => flow.id !== id));
  };

  const calculateIRR = () => {
    const flowAmounts = cashFlows.map(flow => parseFloat(flow.amount));

    if (flowAmounts.length < 2 || flowAmounts.some(isNaN)) {
      Alert.alert('Error', 'Ingrese valores numéricos válidos para todos los flujos de caja.');
      setResult(null); setExplanation(''); setIsApproximate(false);
      return;
    }
    if (flowAmounts[0] >= 0) {
        Alert.alert("Advertencia", "El primer flujo (inversión inicial) generalmente es negativo.");
    }

    let irr = 0.1; 
    const precision = 0.00001;
    const maxIterations = 100;
    let iteration = 0;
    let calculated = false;
    let approximation = false;

    try {
      while (iteration < maxIterations) {
        let npv = 0;
        let dnpv = 0;

        for (let t = 0; t < flowAmounts.length; t++) {
          const denominator = Math.pow(1 + irr, t);
          if (denominator === 0) throw new Error('División por cero en NPV.');
          npv += flowAmounts[t] / denominator;

          if (t > 0) {
            const derivativeDenominator = Math.pow(1 + irr, t + 1);
            if (derivativeDenominator === 0) throw new Error('División por cero en dNPV.');
            dnpv -= t * flowAmounts[t] / derivativeDenominator;
          }
        }

        if (Math.abs(dnpv) < 1e-10) {
          throw new Error('Derivada cercana a cero, posible problema de convergencia.');
        }
        
        const newIrr = irr - npv / dnpv;

        if (isNaN(newIrr) || !isFinite(newIrr)) {
            throw new Error('Cálculo resultó en un valor no numérico o infinito.');
        }

        if (Math.abs(newIrr - irr) < precision) {
          irr = newIrr;
          calculated = true;
          break;
        }

        irr = newIrr;
        iteration++;
      }

      if (!calculated) {
          approximation = true;
          Alert.alert('Advertencia', `No se alcanzó la precisión deseada en ${maxIterations} iteraciones. El resultado es una aproximación.`);
      }

      setResult(`TIR: ${(irr * 100).toFixed(2)}%${approximation ? ' (aprox.)' : ''}`);
      setIsApproximate(approximation);
      setExplanation(`La Tasa Interna de Retorno (TIR) es la tasa de descuento que iguala el Valor Presente Neto (VPN) de los flujos a cero.\n\nFlujos: ${flowAmounts.join(', ')}\n\nMétodo: Newton-Raphson.`);

    } catch (error: any) {
        console.error("Error calculando TIR:", error);
        Alert.alert('Error', `No se pudo calcular la TIR. ${error.message || 'Revise los flujos.'}`);
        setResult(null);
        setExplanation('');
        setIsApproximate(false);
    }
  };
  
  const renderFlowItem = ({ item, index }: { item: CashFlowItem, index: number }) => (
    <View style={styles.flowRow}>
      <Text style={styles.flowLabel}>Flujo {index}:</Text>
      <TextInput
        style={styles.flowInput}
        placeholder={index === 0 ? "-1000 (Inversión)" : "200"}
        value={item.amount}
        onChangeText={(text) => handleFlowChange(item.id, text)}
        keyboardType="default"
      />
      {cashFlows.length > 2 && (
          <TouchableOpacity onPress={() => removeFlow(item.id)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>X</Text>
          </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cashFlows}
        renderItem={renderFlowItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Tasa Interna de Retorno (TIR)</Text>
              <Text style={styles.description}>
                Ingrese la secuencia de flujos de caja. El primero suele ser la inversión inicial (negativa).
              </Text>
            </View>
        )}
        ListFooterComponent={() => (
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.addButton} onPress={addFlow}>
                  <Text style={styles.addButtonText}>+ Añadir Flujo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.calculateButton} onPress={calculateIRR}>
                  <Text style={styles.calculateButtonText}>Calcular TIR</Text>
                </TouchableOpacity>
                {result !== null && (
                  <View style={[styles.resultContainer, isApproximate && styles.approxResultContainer]}>
                    <Text style={styles.resultTitle}>Resultado:</Text>
                    <Text style={[styles.resultText, isApproximate && styles.approxResultText]}>{result}</Text>
                    <Text style={styles.explanationTitle}>Explicación:</Text>
                    <Text style={styles.explanationText}>{explanation}</Text>
                  </View>
                )}
            </View>
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContentContainer: {
      paddingHorizontal: 15,
      paddingBottom: 30,
  },
  headerContainer: {
      marginBottom: 20,
      paddingTop: 20,
  },
  footerContainer: {
      marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  flowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  flowLabel: {
    fontSize: 16,
    color: '#444',
    marginRight: 10,
    width: 60,
  },
  flowInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    marginRight: 5,
  },
  removeButton: {
      backgroundColor: '#FFCDD2',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  removeButtonText: {
      color: '#D32F2F',
      fontSize: 14,
      fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#C8E6C9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#388E3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calculateButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  approxResultContainer: {
      borderColor: '#FFB74D',
      backgroundColor: '#FFF8E1',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 15,
    textAlign: 'center',
  },
   approxResultText: {
      color: '#F57C00',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TIRScreen; 