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
  Image,
  Linking,
} from 'react-native';
import { checkinsService } from '../services/CheckInsService';
import { trainingService } from '../../training/services/TrainingService';
import { CheckIn, CreateCheckInInput } from '../types';
import { TrainingSession } from '../../training/types';
import { colors } from '../../../shared/constants/colors';

interface CheckInsScreenProps {
  onBack: () => void;
}

const SCALE_FIELDS: { field: keyof CreateCheckInInput; label: string }[] = [
  { field: 'energyLevel', label: 'Energia' },
  { field: 'nutritionAdherence', label: 'Aderência nutricional' },
  { field: 'trainingAdherence', label: 'Aderência ao treino' },
  { field: 'sleepQuality', label: 'Qualidade do sono' },
  { field: 'stressLevel', label: 'Estresse' },
  { field: 'mood', label: 'Humor' },
];

export const CheckInsScreen: React.FC<CheckInsScreenProps> = ({ onBack }) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCheckInInput>({
    date: new Date().toISOString().split('T')[0],
    trainingSessionId: null,
    energyLevel: null,
    nutritionAdherence: null,
    trainingAdherence: null,
    sleepQuality: null,
    stressLevel: null,
    mood: null,
    stepsActual: null,
    cardioActualMinutes: null,
    notes: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [checkInsData, trainingSessionsData] = await Promise.all([
        checkinsService.getAll(),
        trainingService.getAll(),
      ]);
      setCheckIns(checkInsData);
      setTrainingSessions(trainingSessionsData);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar dados');
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
      await checkinsService.create(formData);
      Alert.alert('Sucesso', 'Check-in enviado com sucesso');

      setFormData({
        date: new Date().toISOString().split('T')[0],
        trainingSessionId: null,
        energyLevel: null,
        nutritionAdherence: null,
        trainingAdherence: null,
        sleepQuality: null,
        stressLevel: null,
        mood: null,
        stepsActual: null,
        cardioActualMinutes: null,
        notes: null,
      });

      await loadData();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao enviar check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (checkInId: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente remover este check-in?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(checkInId);
              await checkinsService.delete(checkInId);
              Alert.alert('Sucesso', 'Check-in removido com sucesso');
              await loadData();
            } catch (error) {
              Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao remover check-in');
            } finally {
              setIsDeleting(null);
            }
          },
        },
      ]
    );
  };

  const handlePhotoPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir a foto');
    });
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
          <Text style={styles.title}>Check-ins</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Enviar check-in diário</Text>
            <Text style={styles.formSubtitle}>
              Informe como foi seu dia, selecione o treino realizado, avalie os indicadores e compartilhe fotos se desejar.
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
              <Text style={styles.label}>Treino realizado</Text>
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>
                  {formData.trainingSessionId
                    ? trainingSessions.find((s) => s.id === formData.trainingSessionId)?.workoutName ||
                      'Selecione o treino do dia'
                    : 'Selecione o treino do dia'}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trainingSessionsList}>
                <TouchableOpacity
                  style={[
                    styles.trainingSessionOption,
                    !formData.trainingSessionId && styles.trainingSessionOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, trainingSessionId: null })}
                >
                  <Text
                    style={[
                      styles.trainingSessionOptionText,
                      !formData.trainingSessionId && styles.trainingSessionOptionTextSelected,
                    ]}
                  >
                    Nenhum
                  </Text>
                </TouchableOpacity>
                {trainingSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    style={[
                      styles.trainingSessionOption,
                      formData.trainingSessionId === session.id && styles.trainingSessionOptionSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, trainingSessionId: session.id })}
                  >
                    <Text
                      style={[
                        styles.trainingSessionOptionText,
                        formData.trainingSessionId === session.id && styles.trainingSessionOptionTextSelected,
                      ]}
                    >
                      {new Date(session.date).toLocaleDateString('pt-BR')} • {session.workoutName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.helperText}>Se não encontrar o treino, consulte seu coach.</Text>
            </View>

            <View style={styles.scaleFieldsContainer}>
              {SCALE_FIELDS.map((field) => (
                <View key={field.field} style={styles.scaleField}>
                  <Text style={styles.label}>{field.label} (0-5)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData[field.field]?.toString() || ''}
                    onChangeText={(text) => {
                      const num = text ? parseInt(text, 10) : null;
                      if (num !== null && (num < 0 || num > 5)) return;
                      setFormData({ ...formData, [field.field]: num });
                    }}
                    placeholder="0-5"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                </View>
              ))}
            </View>

            <View style={styles.optionalFieldsContainer}>
              <View style={styles.optionalField}>
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
                  placeholder="opcional"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.optionalField}>
                <Text style={styles.label}>Cardio (minutos)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cardioActualMinutes?.toString() || ''}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      cardioActualMinutes: text ? parseInt(text, 10) : null,
                    })
                  }
                  placeholder="opcional"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={[styles.field, styles.fieldFull]}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes || ''}
                onChangeText={(text) => setFormData({ ...formData, notes: text || null })}
                placeholder="Como foi a semana? Alguma dificuldade?"
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
                {isSubmitting ? 'Enviando...' : 'Enviar check-in'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico enviado</Text>
            <Text style={styles.historyCount}>
              {checkIns.length} envio{checkIns.length === 1 ? '' : 's'}
            </Text>
          </View>

          {checkIns.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>
                Você ainda não enviou nenhum check-in. Utilize o formulário acima para iniciar o acompanhamento.
              </Text>
            </View>
          ) : (
            <View style={styles.checkInsList}>
              {checkIns.map((entry) => (
                <View key={entry.id} style={styles.checkInCard}>
                  <View style={styles.checkInHeader}>
                    <View style={styles.checkInHeaderContent}>
                      <Text style={styles.checkInDate}>
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(entry.date))}
                      </Text>
                      <Text style={styles.checkInCreatedAt}>
                        Enviado em{' '}
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(entry.createdAt))}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.deleteButton,
                        isDeleting === entry.id && styles.deleteButtonDisabled,
                      ]}
                      onPress={() => handleDelete(entry.id)}
                      disabled={isDeleting === entry.id}
                    >
                      <Text style={styles.deleteButtonText}>
                        {isDeleting === entry.id ? 'Removendo...' : 'Remover'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.checkInContent}>
                    <View style={styles.trainingSessionCard}>
                      <Text style={styles.trainingSessionLabel}>Treino realizado</Text>
                      <Text style={styles.trainingSessionValue}>
                        {entry.trainingSession
                          ? `${new Date(entry.trainingSession.date).toLocaleDateString('pt-BR')} • ${entry.trainingSession.workoutName}`
                          : 'Não selecionado'}
                      </Text>
                    </View>

                    <View style={styles.metricsGrid}>
                      {SCALE_FIELDS.map((field) => (
                        <View key={`${entry.id}-${field.field}`} style={styles.metricCard}>
                          <Text style={styles.metricLabel}>{field.label}</Text>
                          <Text style={styles.metricValue}>
                            {entry[field.field] !== null && entry[field.field] !== undefined
                              ? `${entry[field.field]}/5`
                              : '—'}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {entry.notes && (
                      <View style={styles.notesSection}>
                        <Text style={styles.notesLabel}>Observações</Text>
                        <Text style={styles.notesText}>{entry.notes}</Text>
                      </View>
                    )}

                    {entry.photos.length > 0 && (
                      <View style={styles.photosSection}>
                        <Text style={styles.photosLabel}>Fotos anexadas</Text>
                        <View style={styles.photosGrid}>
                          {entry.photos.map((photo) => (
                            <TouchableOpacity
                              key={photo.id}
                              style={styles.photoContainer}
                              onPress={() => handlePhotoPress(photo.url)}
                            >
                              <Image
                                source={{ uri: photo.thumbnailUrl || photo.url }}
                                style={styles.photo}
                                resizeMode="cover"
                              />
                              {photo.capturedAt && (
                                <View style={styles.photoDateBadge}>
                                  <Text style={styles.photoDateText}>
                                    {new Date(photo.capturedAt).toLocaleDateString('pt-BR')}
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
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
  pickerContainer: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
  },
  pickerText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  trainingSessionsList: {
    marginTop: 8,
    marginBottom: 4,
  },
  trainingSessionOption: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  trainingSessionOptionSelected: {
    backgroundColor: 'rgba(195, 254, 0, 0.1)',
    borderColor: colors.accent,
  },
  trainingSessionOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trainingSessionOptionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scaleFieldsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  scaleField: {
    flex: 1,
    minWidth: '30%',
    gap: 8,
  },
  optionalFieldsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionalField: {
    flex: 1,
    gap: 8,
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
  checkInsList: {
    gap: 16,
  },
  checkInCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    flexWrap: 'wrap',
    gap: 8,
  },
  checkInHeaderContent: {
    flex: 1,
  },
  checkInDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  checkInCreatedAt: {
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
  checkInContent: {
    padding: 16,
    gap: 16,
  },
  trainingSessionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  trainingSessionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  trainingSessionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  notesSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  photosSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  photosLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    flex: 1,
    minWidth: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoDateBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoDateText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
  },
});
