import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
});
