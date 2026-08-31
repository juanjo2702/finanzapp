import { ParsedBankTransaction } from '@finanzapp/shared-types';

export interface BankNotificationEvent {
  sender: string; // e.g. "BCP", "BNB", "BANCO UNION"
  message: string;
  timestamp: number;
}

export class MobileNotificationListenerService {
  /**
   * Initializes the native Android notification & SMS listener
   * Calls backend /api/banking/parse-notification when a bank message arrives
   */
  static async handleIncomingNotification(
    event: BankNotificationEvent,
    apiUrl: string,
    authToken: string,
  ): Promise<ParsedBankTransaction | null> {
    try {
      const response = await fetch(`${apiUrl}/banking/parse-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rawMessage: event.message }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.parsedTransaction;
    } catch (error) {
      console.error('Error auto-parsing notification on mobile:', error);
      return null;
    }
  }
}
