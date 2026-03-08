import { auth } from '@/lib/firebase';

export type NotificationType = 'appointments' | 'blood_emergencies' | 'messages';

interface SendNotificationParams {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface SendNotificationResult {
  eligible_user_ids: string[];
  skipped_user_ids: string[];
  total_targeted: number;
  total_eligible: number;
  total_skipped: number;
}

async function getFirebaseToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

/**
 * Sends a notification filtered by user preferences via the edge function.
 * Users who have disabled the given notification type will be excluded.
 */
export async function sendFilteredNotification(
  params: SendNotificationParams
): Promise<SendNotificationResult> {
  const token = await getFirebaseToken();
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/send-notification`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_ids: params.userIds,
        type: params.type,
        title: params.title,
        body: params.body,
        data: params.data,
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    console.error('[sendFilteredNotification] error:', data);
    throw new Error(data.error || 'Notification failed');
  }

  return data as SendNotificationResult;
}
