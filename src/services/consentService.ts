// cita-rd/src/services/consentService.ts
import { db } from '../../services/firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export interface ConsentRecord {
  id?: string;
  userId: string;
  userEmail: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageConfirmed: boolean;
  marketingOptIn: boolean;
  timestamp: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  version: string; // Version of terms/privacy policy
}

export interface ConsentData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageConfirmed: boolean;
  marketingOptIn: boolean;
  timestamp: string;
  userEmail?: string;
}

class ConsentService {
  private readonly COLLECTION_NAME = 'user_consents';
  private readonly CURRENT_VERSION = '1.0.0'; // Update when terms/privacy change

  /**
   * Save user consent to Firestore
   */
  async saveConsent(userId: string, consentData: ConsentData): Promise<void> {
    try {
      const consentRecord: Omit<ConsentRecord, 'id'> = {
        userId,
        userEmail: consentData.userEmail || '',
        termsAccepted: consentData.termsAccepted,
        privacyAccepted: consentData.privacyAccepted,
        ageConfirmed: consentData.ageConfirmed,
        marketingOptIn: consentData.marketingOptIn,
        timestamp: Timestamp.fromDate(new Date(consentData.timestamp)),
        version: this.CURRENT_VERSION,
        // Optional: Add IP and User Agent for legal compliance
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent
      };

      // Save to consents collection
      await addDoc(collection(db, this.COLLECTION_NAME), consentRecord);

      // Also save to user document for quick access
      await setDoc(doc(db, 'users', userId), {
        consents: {
          termsAccepted: consentData.termsAccepted,
          privacyAccepted: consentData.privacyAccepted,
          ageConfirmed: consentData.ageConfirmed,
          marketingOptIn: consentData.marketingOptIn,
          lastUpdated: Timestamp.fromDate(new Date(consentData.timestamp)),
          version: this.CURRENT_VERSION
        }
      }, { merge: true });

      console.log('✅ Consent saved successfully for user:', userId);
    } catch (error) {
      console.error('❌ Error saving consent:', error);
      throw new Error('Failed to save consent');
    }
  }

  /**
   * Get user's current consent status
   */
  async getUserConsent(userId: string): Promise<ConsentRecord | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists() && userDoc.data().consents) {
        const consents = userDoc.data().consents;
        return {
          userId,
          userEmail: userDoc.data().email || '',
          termsAccepted: consents.termsAccepted || false,
          privacyAccepted: consents.privacyAccepted || false,
          ageConfirmed: consents.ageConfirmed || false,
          marketingOptIn: consents.marketingOptIn || false,
          timestamp: consents.lastUpdated,
          version: consents.version || '1.0.0'
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error getting user consent:', error);
      return null;
    }
  }

  /**
   * Check if user has valid consents for current version
   */
  async hasValidConsents(userId: string): Promise<boolean> {
    try {
      const consent = await this.getUserConsent(userId);
      
      if (!consent) return false;

      // Check if user has accepted required consents
      const hasRequiredConsents = consent.termsAccepted && 
                                 consent.privacyAccepted && 
                                 consent.ageConfirmed;

      // Check if consent is for current version
      const isCurrentVersion = consent.version === this.CURRENT_VERSION;

      return hasRequiredConsents && isCurrentVersion;
    } catch (error) {
      console.error('❌ Error checking consent validity:', error);
      return false;
    }
  }

  /**
   * Get all consent records for a user (for data export)
   */
  async getUserConsentHistory(userId: string): Promise<ConsentRecord[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const consents: ConsentRecord[] = [];

      querySnapshot.forEach((doc) => {
        consents.push({
          id: doc.id,
          ...doc.data()
        } as ConsentRecord);
      });

      // Sort by timestamp (newest first)
      consents.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      return consents;
    } catch (error) {
      console.error('❌ Error getting consent history:', error);
      return [];
    }
  }

  /**
   * Update marketing consent (can be changed after registration)
   */
  async updateMarketingConsent(userId: string, marketingOptIn: boolean): Promise<void> {
    try {
      // Save new consent record
      const consentData: ConsentData = {
        termsAccepted: true, // Assume already accepted
        privacyAccepted: true, // Assume already accepted
        ageConfirmed: true, // Assume already confirmed
        marketingOptIn,
        timestamp: new Date().toISOString()
      };

      await this.saveConsent(userId, consentData);

      console.log('✅ Marketing consent updated for user:', userId);
    } catch (error) {
      console.error('❌ Error updating marketing consent:', error);
      throw new Error('Failed to update marketing consent');
    }
  }

  /**
   * Delete all user consent data (for account deletion)
   */
  async deleteUserConsents(userId: string): Promise<void> {
    try {
      // Get all consent records for user
      const consents = await this.getUserConsentHistory(userId);

      // Delete all consent records
      const deletePromises = consents.map(consent => {
        if (consent.id) {
          return setDoc(doc(db, this.COLLECTION_NAME, consent.id), {
            deleted: true,
            deletedAt: Timestamp.now()
          }, { merge: true });
        }
      });

      await Promise.all(deletePromises);

      // Remove consents from user document
      await setDoc(doc(db, 'users', userId), {
        consents: null
      }, { merge: true });

      console.log('✅ User consents deleted for user:', userId);
    } catch (error) {
      console.error('❌ Error deleting user consents:', error);
      throw new Error('Failed to delete user consents');
    }
  }

  /**
   * Get client IP address (for legal compliance)
   */
  private async getClientIP(): Promise<string> {
    try {
      // In production, you might want to use a service to get the real IP
      // For now, we'll use a placeholder
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.warn('Could not get client IP:', error);
      return 'unknown';
    }
  }

  /**
   * Check if terms/privacy policy version has been updated
   */
  needsConsentUpdate(userVersion: string): boolean {
    return userVersion !== this.CURRENT_VERSION;
  }

  /**
   * Get current version of terms/privacy
   */
  getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }
}

export const consentService = new ConsentService();
export default consentService;