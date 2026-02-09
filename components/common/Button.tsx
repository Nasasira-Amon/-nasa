import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../lib/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    if (variant === 'primary') return styles.primary;
    if (variant === 'secondary') return styles.secondary;
    return styles.outline;
  };

  const getTextStyle = () => {
    if (variant === 'outline') return styles.outlineText;
    return styles.text;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.secondary : theme.colors.text} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: theme.colors.secondary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  outlineText: {
    color: theme.colors.secondary,
  },
});
