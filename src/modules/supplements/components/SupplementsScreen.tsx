import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { supplementsService } from '../services/SupplementsService';
import { SupplementPlan } from '../types';
import { colors } from '../../../shared/constants/colors';

interface SupplementsScreenProps {
  onBack: () => void;
}

export const SupplementsScreen: React.FC<SupplementsScreenProps> = ({ onBack }) => {
  const [plans, setPlans] = useState<SupplementPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await supplementsService.getAll();
      setPlans(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar suplementos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (plans.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planos de suplementação</Text>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Planos de suplementação</Text>
          <Text style={styles.emptyText}>
            Nenhum protocolo de suplemento disponível no momento.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Planos de suplementação</Text>
        <Text style={styles.subtitle}>
          {plans.length} {plans.length === 1 ? 'protocolo disponível' : 'protocolos disponíveis'}
        </Text>
      </View>

      {plans.map((plan) => (
        <View key={plan.id} style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.periodTitle}>Período</Text>
              <Text style={styles.periodDate}>
                {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
                  new Date(plan.periodStart)
                )}{' '}
                — {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(plan.periodEnd))}
              </Text>
            </View>
          </View>

          <View style={styles.planContent}>
            {plan.protocols.map((protocol, protocolIndex) => (
              <View key={protocol.id} style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <View style={styles.protocolNumber}>
                    <Text style={styles.protocolNumberText}>{protocolIndex + 1}</Text>
                  </View>
                  <Text style={styles.protocolName}>{protocol.supplementName}</Text>
                </View>

                <View style={styles.protocolDetails}>
                  {protocol.dosage && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dosagem:</Text>
                      <Text style={styles.detailValueAccent}>{protocol.dosage}</Text>
                    </View>
                  )}

                  {protocol.frequency && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Frequência:</Text>
                      <Text style={styles.detailValue}>{protocol.frequency}</Text>
                    </View>
                  )}

                  {protocol.timing && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Timing:</Text>
                      <Text style={styles.detailValue}>{protocol.timing}</Text>
                    </View>
                  )}
                </View>

                {protocol.notes && (
                  <View style={styles.protocolNotes}>
                    <Text style={styles.protocolNotesText}>{protocol.notes}</Text>
                  </View>
                )}
              </View>
            ))}

            {plan.notes && (
              <View style={styles.planNotes}>
                <Text style={styles.planNotesLabel}>Observações gerais</Text>
                <Text style={styles.planNotesText}>{plan.notes}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  planHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  periodDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  planContent: {
    padding: 20,
    gap: 12,
  },
  protocolCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  protocolNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(195, 254, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  protocolNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
  },
  protocolName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  protocolDetails: {
    marginTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailValueAccent: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  protocolNotes: {
    marginTop: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  protocolNotesText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  planNotes: {
    marginTop: 16,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  planNotesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  planNotesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

