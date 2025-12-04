import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { trainingService } from '../services/TrainingService';
import { TrainingSession, TrainingExercise } from '../types';
import { colors } from '../../../shared/constants/colors';
import { API_CONFIG } from '../../../shared/config/api';

interface TrainingScreenProps {
  onBack: () => void;
}

interface ExerciseNotesProps {
  notes: string;
}

const ExerciseNotes: React.FC<ExerciseNotesProps> = ({ notes }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setIsShouldShowButton] = useState(false);

  React.useEffect(() => {
    // Simular verificação de altura (no React Native não temos getComputedStyle)
    // Se a nota tiver mais de ~150 caracteres, mostra botão
    setIsShouldShowButton(notes.length > 150);
  }, [notes]);

  const displayText = isExpanded || !shouldShowButton ? notes : notes.substring(0, 150) + '...';

  return (
    <View style={styles.exerciseNotesContainer}>
      <Text style={styles.exerciseNotesText}>{displayText}</Text>
      {shouldShowButton && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.expandButton}>
            {isExpanded ? 'Ver menos' : 'Ver mais'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ExerciseMediaProps {
  exercise: TrainingExercise;
}

const ExerciseMedia: React.FC<ExerciseMediaProps> = ({ exercise }) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const hasValidYouTube = exercise.youtubeUrl && exercise.youtubeUrl.trim().length > 0;
  const hasImages = exercise.name && exercise.folderName;

  const getExerciseImageUrl = (imageIndex: number): string => {
    const baseUrl = API_CONFIG.baseURL.replace('/api/mobile', '');

    if (exercise.folderName) {
      return `${baseUrl}/api/exercises/images/${exercise.folderName}/images/${imageIndex}.jpg`;
    }

    const folderNameFromName = exercise.name.replace(/\s+/g, '_');
    return `${baseUrl}/api/exercises/images/${folderNameFromName}/images/${imageIndex}.jpg`;
  };

  const handleOpenYouTube = () => {
    if (exercise.youtubeUrl) {
      Linking.openURL(exercise.youtubeUrl).catch(() => {
        Alert.alert('Erro', 'Não foi possível abrir o vídeo');
      });
    }
  };

  if (!hasValidYouTube && !hasImages) {
    return null;
  }

  return (
    <View style={styles.exerciseMediaContainer}>
      {hasImages && (
        <>
          {[0, 1].map((imageIndex) => {
            const hasFailed = failedImages.has(imageIndex);
            if (hasFailed) return null;

            const imageUrl = getExerciseImageUrl(imageIndex);

            return (
              <View key={`${exercise.folderName}-${imageIndex}`} style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.exerciseImage}
                  resizeMode="contain"
                  onLoad={() => {
                    setLoadedImages((prev) => new Set([...prev, imageIndex]));
                  }}
                  onError={() => {
                    setFailedImages((prev) => new Set([...prev, imageIndex]));
                  }}
                />
              </View>
            );
          })}
        </>
      )}

      {hasValidYouTube && (
        <View style={styles.videoContainer}>
          <Text style={styles.videoLabel}>Vídeo demonstrativo</Text>
          <TouchableOpacity style={styles.videoButton} onPress={handleOpenYouTube}>
            <Text style={styles.videoButtonText}>Abrir vídeo no YouTube</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const TrainingScreen: React.FC<TrainingScreenProps> = ({ onBack }) => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await trainingService.getAll();
      setSessions(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar treinos');
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

  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planos de treino</Text>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Planos de treino</Text>
          <Text style={styles.emptyText}>
            Nenhum plano de treino disponível no momento. Entre em contato com seu coach.
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
        <Text style={styles.title}>Planos de treino</Text>
        <Text style={styles.subtitle}>
          {sessions.length} {sessions.length === 1 ? 'treino disponível' : 'treinos disponíveis'}
        </Text>
      </View>

      {sessions.map((session) => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionHeaderContent}>
              <Text style={styles.workoutName}>{session.workoutName}</Text>
              <Text style={styles.sessionDate}>
                Criado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(session.date))}
              </Text>
            </View>
            {session.durationMinutes && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{session.durationMinutes} min</Text>
              </View>
            )}
          </View>

          <View style={styles.sessionContent}>
            {session.exercises.length === 0 ? (
              <View style={styles.noExercisesCard}>
                <Text style={styles.noExercisesText}>Nenhum exercício cadastrado.</Text>
              </View>
            ) : (
              <View style={styles.exercisesContainer}>
                {[...session.exercises].sort((a, b) => a.order - b.order).map((exercise, exerciseIndex) => (
                  <View key={exercise.id} style={styles.exerciseCard}>
                    <View style={styles.exerciseHeader}>
                      <View style={styles.exerciseHeaderRow}>
                        <View style={styles.exerciseNumber}>
                          <Text style={styles.exerciseNumberText}>{exerciseIndex + 1}</Text>
                        </View>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                      </View>
                      <View style={styles.seriesBadge}>
                        <Text style={styles.seriesBadgeText}>
                          {exercise.sets.length} {exercise.sets.length === 1 ? 'série' : 'séries'}
                        </Text>
                      </View>
                    </View>

                    {exercise.notes && <ExerciseNotes notes={exercise.notes} />}

                    <ExerciseMedia exercise={exercise} />

                    {exercise.sets.length > 0 && (
                      <View style={styles.setsContainer}>
                        <View style={styles.setsHeader}>
                          <Text style={styles.setsHeaderText}>Série</Text>
                          <Text style={[styles.setsHeaderText, styles.setsHeaderCenter]}>Reps</Text>
                          <Text style={[styles.setsHeaderText, styles.setsHeaderRight]}>Peso</Text>
                        </View>
                        <View style={styles.setsList}>
                          {exercise.sets.map((set) => (
                            <View key={`${exercise.id}-${set.setIndex}`} style={styles.setRow}>
                              <Text style={styles.setLabel}>Série {set.setIndex}</Text>
                              <Text style={[styles.setValue, styles.setCenter]}>
                                {set.reps ? `${set.reps} reps` : '—'}
                              </Text>
                              <Text style={[styles.setValue, styles.setRight, styles.setWeight]}>
                                {set.weightKg ? `${set.weightKg} kg` : '—'}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
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
  sessionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  sessionHeaderContent: {
    flex: 1,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  durationBadge: {
    backgroundColor: 'rgba(195, 254, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(195, 254, 0, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  sessionContent: {
    padding: 20,
  },
  noExercisesCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
  },
  noExercisesText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exercisesContainer: {
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  exerciseHeader: {
    marginBottom: 12,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(195, 254, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
  },
  exerciseName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seriesBadge: {
    alignSelf: 'flex-end',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seriesBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  exerciseNotesContainer: {
    marginBottom: 12,
  },
  exerciseNotesText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  expandButton: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.accent,
    marginTop: 4,
  },
  exerciseMediaContainer: {
    marginBottom: 16,
    gap: 12,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    maxHeight: 500,
  },
  videoContainer: {
    marginTop: 8,
  },
  videoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  videoButton: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  videoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  setsContainer: {
    marginTop: 16,
  },
  setsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setsHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  setsHeaderCenter: {
    textAlign: 'center',
  },
  setsHeaderRight: {
    textAlign: 'right',
  },
  setsList: {
    gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
  },
  setLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  setValue: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  setCenter: {
    textAlign: 'center',
  },
  setRight: {
    textAlign: 'right',
  },
  setWeight: {
    color: colors.accent,
    fontWeight: '600',
  },
});
