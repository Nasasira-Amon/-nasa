import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../lib/theme';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Seller Payments and Upload Fees</Text>
          <Text style={styles.text}>
            - For listings with images: If the item price exceeds $3, a 5% fee will be
            charged before upload.{'\n'}
            - For listings with videos: A 9% fee will be charged based on the quoted
            price before upload.{'\n'}
            - All fees must be paid before the listing can be published.{'\n'}
            - Accepted payment methods include DFCU bank transfer, credit card, and MTN
            MoMo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. Donations and Giveaway Responsibility
          </Text>
          <Text style={styles.text}>
            - Donors must ensure items are in acceptable condition.{'\n'}
            - Tagged recipients will be notified via email or WhatsApp.{'\n'}
            - DealSwapify recommends using nearest drop-off points for delivery.{'\n'}
            - The platform is not responsible for delivery or condition disputes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Data Protection</Text>
          <Text style={styles.text}>
            - All user data is encrypted and stored securely.{'\n'}
            - Two-step verification is available for enhanced security.{'\n'}
            - We perform automatic cloud backups of all sales and uploads.{'\n'}
            - User data will not be shared with third parties without consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Prohibited Uploads</Text>
          <Text style={styles.text}>
            - Illegal items or services{'\n'}
            - Counterfeit or stolen goods{'\n'}
            - Items that violate intellectual property rights{'\n'}
            - Hazardous materials or weapons{'\n'}
            - Adult content or services
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Fraud and Impersonation</Text>
          <Text style={styles.text}>
            - Users must provide accurate information.{'\n'}
            - Impersonation of other users or entities is strictly prohibited.{'\n'}
            - Fraudulent listings will be removed immediately.{'\n'}
            - Repeated violations may result in account suspension.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Refund Policy</Text>
          <Text style={styles.text}>
            - If a payment fails, funds will be refunded within 5-7 business days.{'\n'}
            - Upload fees are non-refundable once the listing is published.{'\n'}
            - Disputes must be reported within 48 hours of transaction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. AI Validation</Text>
          <Text style={styles.text}>
            - Uploads are subject to AI validation for category matching.{'\n'}
            - Items uploaded to incorrect categories may be rejected.{'\n'}
            - Users will receive recommendations for correct categories.{'\n'}
            - This ensures better browsing experience for all users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact Information</Text>
          <Text style={styles.text}>
            - Sellers are responsible for providing accurate contact details.{'\n'}
            - Chat messages have length limits to encourage direct communication.{'\n'}
            - WhatsApp integration allows seamless external communication.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Account Termination</Text>
          <Text style={styles.text}>
            - DealSwapify reserves the right to terminate accounts that violate these
            terms.{'\n'}
            - Users may delete their accounts at any time through the profile settings.
            {'\n'}
            - All data will be permanently deleted upon account termination.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
          <Text style={styles.text}>
            - These terms may be updated periodically.{'\n'}
            - Users will be notified of significant changes.{'\n'}
            - Continued use of the platform constitutes acceptance of updated terms.
          </Text>
        </View>

        <Text style={styles.footer}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
