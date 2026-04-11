import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, radius, spacing, typography } from '../styles/theme';

// ── INPUT FIELD ────────────────────────────────────────────────────────────
export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  ...props
}) {
  return (
    <View style={inputStyles.wrapper}>
      {label ? <Text style={inputStyles.label}>{label}</Text> : null}
      <TextInput
        style={[inputStyles.input, error && inputStyles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        {...props}
      />
      {error ? <Text style={inputStyles.errorText}>{error}</Text> : null}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrapper: { gap: 5 },
  label: {
    fontSize: 11,
    color: colors.muted2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    fontSize: 11,
    color: colors.red,
    marginTop: 2,
  },
});

// ── PRIMARY BUTTON ─────────────────────────────────────────────────────────
export function AppButton({ title, onPress, loading, style, variant = 'primary' }) {
  const bg = variant === 'primary' ? colors.accent : colors.surface2;
  return (
    <TouchableOpacity
      style={[btnStyles.btn, { backgroundColor: bg }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={btnStyles.label}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  btn: {
    borderRadius: radius.sm,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
});

// ── HEADER DA TELA DE FORMULÁRIO ───────────────────────────────────────────
export function FormHeader({ title, subtitle, onBack }) {
  return (
    <View style={fhStyles.container}>
      <TouchableOpacity style={fhStyles.back} onPress={onBack} activeOpacity={0.7}>
        <Text style={fhStyles.backIcon}>←</Text>
      </TouchableOpacity>
      <View>
        <Text style={fhStyles.title}>{title}</Text>
        {subtitle ? <Text style={fhStyles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const fhStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 16, color: colors.muted2 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 11, color: colors.muted, marginTop: 1 },
});

// ── SECTION LABEL ──────────────────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <Text style={slStyles.label}>{children}</Text>
  );
}

const slStyles = StyleSheet.create({
  label: {
    fontSize: 10,
    color: colors.accent2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 6,
  },
});
