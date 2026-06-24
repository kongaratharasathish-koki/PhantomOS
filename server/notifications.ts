import { AlertDestination, VerificationTrace } from "../src/types.ts";

export class NotificationService {
  static async notify(trace: VerificationTrace, alerts: AlertDestination[]) {
    const enabledAlerts = alerts.filter(a => a.enabled && a.tenant_id === trace.tenant_id);
    
    for (const alert of enabledAlerts) {
      try {
        if (alert.type === 'WEBHOOK' || alert.type === 'SLACK' || alert.type === 'DISCORD') {
          if (alert.config.url) {
            await fetch(alert.config.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: `🚨 PhantomOS Alert: ${trace.outcome} for Agent ${trace.capability_id}`,
                attachments: [
                  {
                    title: "Violation Details",
                    text: trace.details,
                    fields: [
                      { title: "Agent", value: trace.capability_id, short: true },
                      { title: "Outcome", value: trace.outcome, short: true },
                      { title: "Evidence Hash", value: trace.hash || 'N/A', short: false }
                    ],
                    ts: Math.floor(new Date(trace.timestamp).getTime() / 1000)
                  }
                ]
              })
            });
          }
        }
      } catch (e) {
        console.error(`NotificationService: Failed to send ${alert.type} alert`, e);
      }
    }
  }
}
