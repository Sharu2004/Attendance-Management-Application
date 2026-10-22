import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { colors, typography, borderRadius, spacing, shadows } from '../../theme/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

export const LoginScreen: React.FC = () => {
  const { login, isActionLoading, error, clearError } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Email format regex validation
  const isValidEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text.trim());
  };

  const handleLogin = async () => {
    setValidationError(null);
    clearError();

    // 1. Empty field validation
    if (!email.trim() && !password.trim()) {
      setValidationError('Please enter both email and password.');
      return;
    }
    if (!email.trim()) {
      setValidationError('Email address cannot be empty.');
      return;
    }
    if (!password.trim()) {
      setValidationError('Password cannot be empty.');
      return;
    }

    // 2. Email format validation
    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address format.');
      return;
    }

    // 3. Authenticate
    await login(email, password);
  };

  // Quick fill demo credentials
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setValidationError(null);
    clearError();
  };

  const displayError = validationError || error;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={40} color={colors.accentLight} />
          </View>
          <Text style={styles.appTitle}>Attendance Pro</Text>
          <Text style={styles.appSubtitle}>
            Enterprise Attendance & Workforce Management
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Sign In</Text>
          <Text style={styles.formSub}>
            Enter your employee credentials to access your dashboard.
          </Text>

          {/* Validation / Authentication Error Display */}
          {displayError ? (
            <View testID="login-error-banner" style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                testID="email-input"
                style={styles.input}
                placeholder="name@company.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (validationError) setValidationError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                testID="password-input"
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (validationError) setValidationError(null);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                testID="toggle-password-visibility"
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <PrimaryButton
            testID="login-submit-button"
            title="Log In"
            onPress={handleLogin}
            isLoading={isActionLoading}
            style={styles.submitButton}
          />

          {/* Demonstration Accounts Shortcut Helper */}
          <View style={styles.demoSection}>
            <Text style={styles.demoHeading}>Quick Demo Accounts</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                testID="demo-admin-chip"
                style={[styles.demoChip, { borderColor: colors.roleAdmin }]}
                onPress={() => fillCredentials('admin@test.com', 'Admin@123')}
              >
                <Text style={[styles.demoChipRole, { color: colors.roleAdmin }]}>
                  Admin
                </Text>
                <Text style={styles.demoChipEmail}>admin@test.com</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="demo-senior-chip"
                style={[styles.demoChip, { borderColor: colors.roleSenior }]}
                onPress={() => fillCredentials('senior@test.com', 'Senior@123')}
              >
                <Text style={[styles.demoChipRole, { color: colors.roleSenior }]}>
                  Senior Staff
                </Text>
                <Text style={styles.demoChipEmail}>senior@test.com</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="demo-staff-chip"
                style={[styles.demoChip, { borderColor: colors.roleStaff }]}
                onPress={() => fillCredentials('staff@test.com', 'Staff@123')}
              >
                <Text style={[styles.demoChipRole, { color: colors.roleStaff }]}>
                  Staff
                </Text>
                <Text style={styles.demoChipEmail}>staff@test.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Security & System Info Footer */}
        <Text style={styles.footerNote}>
          Tamil & Indian Employee Demonstration Profile • Offline Persistence Active
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  appTitle: {
    ...typography.h1,
    color: colors.textInverse,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    ...typography.bodyMedium,
    color: colors.accentLight,
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  formTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  formSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: spacing.sm + 2,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '500',
    marginLeft: spacing.xs,
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorderDark,
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    height: '100%',
  },
  eyeButton: {
    padding: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  demoSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  demoHeading: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  demoChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
  },
  demoChipRole: {
    ...typography.caption,
    fontWeight: '700',
  },
  demoChipEmail: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footerNote: {
    ...typography.caption,
    color: colors.accentLight,
    textAlign: 'center',
    marginTop: spacing.xxl,
    opacity: 0.75,
  },
});
