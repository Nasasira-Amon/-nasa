import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { theme } from '../../lib/theme';
import { supabase } from '../../lib/supabase';

interface AnalyticsSectionProps {
  categoryId: string;
}

export default function AnalyticsSection({ categoryId }: AnalyticsSectionProps) {
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [modeStats, setModeStats] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [categoryId]);

  const loadAnalytics = async () => {
    try {
      const { data: categories } = await supabase
        .from('categories')
        .select('name, visit_count')
        .order('visit_count', { ascending: false })
        .limit(5);

      if (categories) {
        setCategoryStats(categories);
      }

      const { data: listings } = await supabase
        .from('listings')
        .select('listing_type');

      if (listings) {
        const modeCounts = listings.reduce((acc: any, listing) => {
          acc[listing.listing_type] = (acc[listing.listing_type] || 0) + 1;
          return acc;
        }, {});

        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
        const modeData = Object.keys(modeCounts).map((key, index) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          count: modeCounts[key],
          color: colors[index % colors.length],
          legendFontColor: theme.colors.textSecondary,
          legendFontSize: 12,
        }));

        setModeStats(modeData);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  const barData = {
    labels: categoryStats.map((cat) => cat.name.substring(0, 8)),
    datasets: [
      {
        data: categoryStats.map((cat) => cat.visit_count),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: theme.borderRadius.md,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  if (categoryStats.length === 0 && modeStats.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>

      {categoryStats.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Most Visited Categories</Text>
          <LineChart
            data={barData}
            width={screenWidth - theme.spacing.lg * 2}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {modeStats.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Most Active Mode</Text>
          <PieChart
            data={modeStats}
            width={screenWidth - theme.spacing.lg * 2}
            height={180}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  chartContainer: {
    marginVertical: theme.spacing.sm,
  },
  chartTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  chart: {
    borderRadius: theme.borderRadius.md,
  },
});
