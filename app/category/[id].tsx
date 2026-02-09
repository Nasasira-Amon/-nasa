import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { theme } from '../../lib/theme';
import { ArrowLeft } from 'lucide-react-native';
import BuyerTab from '../../components/category/BuyerTab';
import SellerTab from '../../components/category/SellerTab';
import DonatorTab from '../../components/category/DonatorTab';
import GiveawayTab from '../../components/category/GiveawayTab';
import AnalyticsSection from '../../components/category/AnalyticsSection';

const initialLayout = { width: Dimensions.get('window').width };

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'buyer', title: 'Buyer' },
    { key: 'seller', title: 'Seller' },
    { key: 'donator', title: 'Donator' },
    { key: 'giveaway', title: 'Giveaway' },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'buyer':
        return <BuyerTab categoryId={id as string} />;
      case 'seller':
        return <SellerTab categoryId={id as string} />;
      case 'donator':
        return <DonatorTab categoryId={id as string} />;
      case 'giveaway':
        return <GiveawayTab categoryId={id as string} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>

      <AnalyticsSection categoryId={id as string} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor={theme.colors.secondary}
            inactiveColor={theme.colors.textSecondary}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabIndicator: {
    backgroundColor: theme.colors.secondary,
  },
  tabLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
});
