import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { activityService } from '../services/ActivityService';
import { ActivityLog, SaveActivityLogInput } from '../types';
import { colors } from '../../../shared/constants/colors';

interface ActivityScreenProps {
  onBack: () => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState<SaveActivityLogInput>({
    date: new Date().toISOString().split('T')[0],
    stepsActual: null,
    stepsTarget: null,
    cardioActualMinutes: null,
    cardioTargetMinutes: null,
    notes: null,
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await activityService.getAll();
      setLogs(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar atividades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      Alert.alert('Erro', 'Data é obrigatória');
      return;
    }

    try {
      setIsSubmitting(true);
      await activityService.create(formData);
      Alert.alert('Sucesso', 'Atividade registrada com sucesso');

      setFormData({
        date: new Date().toISOString().split('T')[0],
        stepsActual: null,
        stepsTarget: null,
        cardioActualMinutes: null,
        cardioTargetMinutes: null,
        notes: null,
      });

      await loadLogs();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao salvar atividade');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (logId: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente remover este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(logId);
              await activityService.delete(logId);
              Alert.alert('Sucesso', 'Registro removido com sucesso');
              await loadLogs();
            } catch (error) {
              Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao remover registro');
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Atividade</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Registrar atividade diária</Text>
            <Text style={styles.formSubtitle}>
              Informe seus passos e minutos de cardio para manter o acompanhamento em dia.
            </Text>
          </View>

          <View style={styles.formFields}>
            <View style={styles.field}>
              <Text style={styles.label}>Data</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Passos realizados</Text>
              <TextInput
                style={styles.input}
                value={formData.stepsActual?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    stepsActual: text ? parseInt(text, 10) : null,
                  })
                }
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Meta de passos</Text>
              <TextInput
                style={styles.input}
                value={formData.stepsTarget?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    stepsTarget: text ? parseInt(text, 10) : null,
                  })
                }
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Minutos de cardio</Text>
              <TextInput
                style={styles.input}
                value={formData.cardioActualMinutes?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    cardioActualMinutes: text ? parseInt(text, 10) : null,
                  })
                }
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Meta de cardio (min)</Text>
              <TextInput
                style={styles.input}
                value={formData.cardioTargetMinutes?.toString() || ''}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    cardioTargetMinutes: text ? parseInt(text, 10) : null,
                  })
                }
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.field, styles.fieldFull]}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes || ''}
                onChangeText={(text) => setFormData({ ...formData, notes: text || null })}
                placeholder="Como você se sentiu, observações sobre o cardio..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Salvando...' : 'Salvar atividade'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico recente</Text>
            <Text style={styles.historyCount}>
              {logs.length} registro{logs.length === 1 ? '' : 's'}
            </Text>
          </View>

          {logs.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Nenhum registro de atividade ainda. Utilize o formulário acima para adicionar o primeiro check-in diário.
              </Text>
            </View>
          ) : (
            <View style={styles.logsList}>
              {logs.map((log) => (
                <View key={log.id} style={styles.logCard}>
                  <View style={styles.logHeader}>
                    <View style={styles.logHeaderContent}>
                      <Text style={styles.logDate}>
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(log.date))}
                      </Text>
                      <Text style={styles.logCreatedAt}>
                        Registrado em{' '}
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(log.date))}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        isDeleting === log.id && styles.deleteButtonDisabled,
                      ]}
                      onPress={() => handleDelete(log.id)}
                      disabled={isDeleting === log.id}
                    >
                      <Text style={styles.deleteButtonText}>
                        {isDeleting === log.id ? 'Removendo...' : 'Remover'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Passos</Text>
                      <Text style={styles.metricValue}>
                        {log.stepsActual ?? '–'} / {log.stepsTarget ?? '–'}
                      </Text>
                    </View>

                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Cardio</Text>
                      <Text style={[styles.metricValue, styles.metricValueAccent]}>
                        {log.cardioActualMinutes ?? '–'} min
                      </Text>
                    </View>

                    <View style={styles.metricCard}>
                      <Text style={styles.metricLabel}>Meta cardio</Text>
                      <Text style={styles.metricValue}>{log.cardioTargetMinutes ?? '–'} min</Text>
                    </View>

                    {log.notes && (
                      <View style={[styles.metricCard, styles.metricCardFull]}>
                        <Text style={styles.metricLabel}>Notas</Text>
                        <Text style={styles.metricNotes} numberOfLines={2}>
                          {log.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  formFields: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  fieldFull: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  historyCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyHistory: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  logsList: {
    gap: 12,
  },
  logCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  logHeaderContent: {
    flex: 1,
  },
  logDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  logCreatedAt: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricCardFull: {
    minWidth: '100%',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricValueAccent: {
    color: colors.accent,
  },
  metricNotes: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});

