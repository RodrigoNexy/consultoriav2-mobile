import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { changePasswordService } from '../services/ChangePasswordService';
import { colors } from '../../../shared/constants/colors';

interface ChangePasswordScreenProps {
  onBack: () => void;
}

interface PasswordRequirement {
  id: string;
  text: string;
  test: (value: string) => boolean;
}

const REQUIREMENT_MESSAGES: PasswordRequirement[] = [
  { id: 'length', text: '8 a 16 caracteres', test: (value: string) => value.length >= 8 && value.length <= 16 },
  { id: 'upper', text: '1 letra maiúscula', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'lower', text: '1 letra minúscula', test: (value: string) => /[a-z]/.test(value) },
  { id: 'number', text: '1 número', test: (value: string) => /\d/.test(value) },
  { id: 'symbol', text: '1 símbolo', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  autoComplete?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, hint, autoComplete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.passwordField}>
      <Text style={styles.passwordLabel}>{label}</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setVisible((prev) => !prev)}
        >
          <Text style={styles.toggleButtonText}>{visible ? 'Ocultar' : 'Mostrar'}</Text>
        </TouchableOpacity>
      </View>
      {hint && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onBack }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requirements = useMemo(
    () => REQUIREMENT_MESSAGES.map((req) => ({ ...req, met: req.test(newPassword) })),
    [newPassword]
  );

  const matchStatus = useMemo(() => {
    if (!newPassword || !confirmPassword) {
      return null;
    }
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword]);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    const strengthError = requirements.find((req) => !req.met);
    if (strengthError) {
      setError('A senha não atende aos requisitos mínimos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas informadas não conferem.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      await changePasswordService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setSuccess('Senha alterada com sucesso!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Text style={styles.title}>Alterar senha</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Defina uma nova senha</Text>
            <Text style={styles.formSubtitle}>
              Use uma senha forte com letras maiúsculas e minúsculas, números e símbolos.
            </Text>
          </View>

          <View style={styles.formFields}>
            <PasswordField
              label="Senha atual"
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <PasswordField
              label="Nova senha"
              value={newPassword}
              onChange={setNewPassword}
            />

            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Requisitos</Text>
              <View style={styles.requirementsList}>
                {requirements.map((requirement) => (
                  <View key={requirement.id} style={styles.requirementItem}>
                    <View
                      style={[
                        styles.requirementDot,
                        requirement.met ? styles.requirementDotMet : styles.requirementDotUnmet,
                      ]}
                    />
                    <Text
                      style={[
                        styles.requirementText,
                        requirement.met ? styles.requirementTextMet : styles.requirementTextUnmet,
                      ]}
                    >
                      {requirement.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <PasswordField
              label="Confirmar nova senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {matchStatus !== null && (
              <Text style={[styles.matchStatus, matchStatus ? styles.matchStatusSuccess : styles.matchStatusError]}>
                {matchStatus ? 'As senhas coincidem.' : 'As senhas não coincidem.'}
              </Text>
            )}

            {error && (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {success && (
              <View style={styles.successCard}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Salvando...' : 'Atualizar senha'}
              </Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  formFields: {
    gap: 16,
  },
  passwordField: {
    gap: 8,
  },
  passwordLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  passwordInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    padding: 12,
    paddingRight: 80,
    fontSize: 14,
    color: colors.textPrimary,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  hintText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  requirementsCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  requirementDotMet: {
    backgroundColor: '#10b981',
  },
  requirementDotUnmet: {
    backgroundColor: colors.borderSubtle,
  },
  requirementText: {
    fontSize: 12,
  },
  requirementTextMet: {
    color: '#10b981',
  },
  requirementTextUnmet: {
    color: colors.textSecondary,
  },
  matchStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchStatusSuccess: {
    color: '#10b981',
  },
  matchStatusError: {
    color: '#ef4444',
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  successCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successText: {
    fontSize: 14,
    color: '#16a34a',
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
});

