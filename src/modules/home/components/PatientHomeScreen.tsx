import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../auth';
import { checkinsService } from '../../checkins';
import { trainingService } from '../../training';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Metrics {
  totalCheckIns: number;
  totalTrainings: number;
  totalDiets: number;
  totalSupplements: number;
  latestCheckIn: {
    date: string;
    weightKg: number | null;
    energyLevel: number | null;
    nutritionAdherence: number | null;
    trainingAdherence: number | null;
    sleepQuality: number | null;
    mood: string | null;
  } | null;
}

export const PatientHomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const [checkIns, trainings] = await Promise.all([
        checkinsService.getAll(),
        trainingService.getAll(),
      ]);

      const latestCheckIn = checkIns[0] || null;

      setMetrics({
        totalCheckIns: checkIns.length,
        totalTrainings: trainings.length,
        totalDiets: 0, // TODO: implementar quando tiver API
        totalSupplements: 0, // TODO: implementar quando tiver API
        latestCheckIn: latestCheckIn
          ? {
              date: latestCheckIn.date,
              weightKg: latestCheckIn.weightKg,
              energyLevel: latestCheckIn.energyLevel,
              nutritionAdherence: latestCheckIn.nutritionAdherence,
              trainingAdherence: latestCheckIn.trainingAdherence,
              sleepQuality: latestCheckIn.sleepQuality,
              mood: latestCheckIn.mood,
            }
          : null,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as métricas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo(a)</Text>
        {user && <Text style={styles.subtitle}>{user.name}</Text>}
      </View>

      {metrics?.latestCheckIn && (
        <View style={styles.lastCheckInCard}>
          <View style={styles.lastCheckInHeader}>
            <Text style={styles.lastCheckInTitle}>Último Check-in</Text>
            <Text style={styles.lastCheckInDate}>
              {new Date(metrics.latestCheckIn.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            {metrics.latestCheckIn.weightKg && (
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Peso</Text>
                <Text style={styles.metricValue}>{metrics.latestCheckIn.weightKg} kg</Text>
              </View>
            )}

            {metrics.latestCheckIn.energyLevel !== null && (
              <MetricBar
                label="Energia"
                value={metrics.latestCheckIn.energyLevel}
                max={5}
              />
            )}

            {metrics.latestCheckIn.nutritionAdherence !== null && (
              <MetricBar
                label="Nutrição"
                value={metrics.latestCheckIn.nutritionAdherence}
                max={5}
              />
            )}

            {metrics.latestCheckIn.trainingAdherence !== null && (
              <MetricBar
                label="Treino"
                value={metrics.latestCheckIn.trainingAdherence}
                max={5}
              />
            )}

            {metrics.latestCheckIn.sleepQuality !== null && (
              <MetricBar
                label="Sono"
                value={metrics.latestCheckIn.sleepQuality}
                max={5}
              />
            )}

            {metrics.latestCheckIn.mood && (
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Humor</Text>
                <Text style={styles.metricValue}>{metrics.latestCheckIn.mood}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => onNavigate('CheckIns')}
          >
            <Text style={styles.viewAllButtonText}>Ver todos os check-ins</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsGrid}>
        <StatCard
          value={metrics?.totalCheckIns || 0}
          label="Check-ins"
          onPress={() => onNavigate('CheckIns')}
        />
        <StatCard
          value={metrics?.totalTrainings || 0}
          label="Treinos"
          onPress={() => onNavigate('Training')}
        />
        <StatCard
          value={metrics?.totalDiets || 0}
          label="Dietas"
          onPress={() => onNavigate('Diet')}
        />
        <StatCard
          value={metrics?.totalSupplements || 0}
          label="Suplementos"
          onPress={() => onNavigate('Supplements')}
        />
      </View>

      <View style={styles.actionsGrid}>
        <ActionButton
          title="Ver check-ins"
          onPress={() => onNavigate('CheckIns')}
        />
        <ActionButton
          title="Ver planos de treino"
          onPress={() => onNavigate('Training')}
        />
        <ActionButton
          title="Ver alimentações"
          onPress={() => onNavigate('Diet')}
        />
        <ActionButton
          title="Ver suplementos"
          onPress={() => onNavigate('Supplements')}
        />
        <ActionButton
          title="Registrar atividade"
          onPress={() => onNavigate('Activity')}
        />
        <ActionButton
          title="Registrar recuperação"
          onPress={() => onNavigate('Recovery')}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ label, value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const getColor = () => {
    if (percentage >= 70) return '#c3fe00';
    if (percentage >= 40) return '#eab308';
    return '#ef4444';
  };

  const getStatus = () => {
    if (percentage >= 70) return '✓ Excelente';
    if (percentage >= 40) return '⚠ Pode melhorar';
    return '⚠ Atenção';
  };

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}/{max}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: getColor() },
          ]}
        />
      </View>
      <Text style={[styles.metricStatus, { color: getColor() }]}>{getStatus()}</Text>
    </View>
  );
};

interface StatCardProps {
  value: number;
  label: string;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

interface ActionButtonProps {
  title: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  lastCheckInCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  lastCheckInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  lastCheckInTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lastCheckInDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c3fe00',
    backgroundColor: 'rgba(195, 254, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  metricStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
  viewAllButton: {
    backgroundColor: 'rgba(195, 254, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(195, 254, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#c3fe00',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

