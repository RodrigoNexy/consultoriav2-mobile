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
import { nutritionService } from '../services/NutritionService';
import { NutritionLog } from '../types';
import { colors } from '../../../shared/constants/colors';

interface DietScreenProps {
  onBack: () => void;
}

export const DietScreen: React.FC<DietScreenProps> = ({ onBack }) => {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await nutritionService.getAll();
      setLogs(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao carregar planos alimentares');
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

  if (logs.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planos alimentares</Text>
        </View>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Planos alimentares</Text>
          <Text style={styles.emptyText}>
            Não há planos alimentares cadastrados no momento.
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
        <Text style={styles.title}>Planos alimentares</Text>
        <Text style={styles.subtitle}>
          {logs.length} {logs.length === 1 ? 'plano disponível' : 'planos disponíveis'}
        </Text>
      </View>

      {logs.map((plan) => (
        <View key={plan.id} style={styles.planCard}>
          <View style={styles.planHeader}>
            <View style={styles.planHeaderContent}>
              <Text style={styles.planTitle}>Plano alimentar</Text>
              <Text style={styles.planPeriod}>
                {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
                  new Date(plan.periodStart)
                )}{' '}
                — {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(plan.periodEnd))}
              </Text>
            </View>
            <View style={styles.planBadges}>
              {plan.periodicity && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{plan.periodicity}</Text>
                </View>
              )}
              {plan.caloriesTarget && (
                <View style={styles.badgeAccent}>
                  <Text style={styles.badgeAccentText}>{plan.caloriesTarget} kcal</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.planContent}>
            {plan.meals
              .sort((a, b) => a.order - b.order)
              .map((meal, mealIndex) => (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealHeader}>
                    <View style={styles.mealHeaderLeft}>
                      <View style={styles.mealNumber}>
                        <Text style={styles.mealNumberText}>{mealIndex + 1}</Text>
                      </View>
                      <Text style={styles.mealName}>{meal.name}</Text>
                    </View>
                    {meal.scheduledAt && (
                      <View style={styles.mealTimeBadge}>
                        <Text style={styles.mealTimeText}>{meal.scheduledAt}</Text>
                      </View>
                    )}
                  </View>

                  {meal.items.length === 0 ? (
                    <Text style={styles.noItemsText}>Nenhum alimento cadastrado.</Text>
                  ) : (
                    <View style={styles.itemsContainer}>
                      <View style={styles.itemsHeader}>
                        <Text style={styles.itemsHeaderText}>Alimento</Text>
                        <Text style={[styles.itemsHeaderText, styles.itemsHeaderRight]}>Quantidade</Text>
                      </View>
                      <View style={styles.itemsList}>
                        {meal.items.map((item) => (
                          <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemName}>{item.foodName}</Text>
                            <Text style={styles.itemQuantity}>
                              {item.quantity !== null && item.quantity !== undefined
                                ? `${item.quantity}${item.unit ? ` ${item.unit}` : ''}`
                                : '—'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {meal.notes && (
                    <View style={styles.mealNotes}>
                      <Text style={styles.mealNotesText}>{meal.notes}</Text>
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
    gap: 12,
  },
  planHeaderContent: {
    flex: 1,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  planBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  badgeAccent: {
    backgroundColor: 'rgba(195, 254, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(195, 254, 0, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeAccentText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  planContent: {
    padding: 20,
    gap: 16,
  },
  mealCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  mealNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(195, 254, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
  },
  mealName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mealTimeBadge: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  mealTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  noItemsText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  itemsContainer: {
    marginTop: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  itemsHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemsHeaderRight: {
    textAlign: 'right',
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  mealNotes: {
    marginTop: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  mealNotesText: {
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

