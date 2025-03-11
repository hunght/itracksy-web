import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Define the structure of Resend webhook events
type ResendWebhookEvent = {
  type: 'email.sent' | 'email.delivered' | 'email.delivery_delayed' | 'email.complained' | 'email.bounced' | 'email.opened' | 'email.clicked';
  data: {
    email_id: string;
    created_at: string;
    to: string[];
    from: string;
    subject: string;
    tags?: { name: string; value: string }[]; 
    // For click events
    click?: {
      user_agent?: string;
      ip?: string;
      url?: string;
    };
  };
};

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (in production, you should verify the signature)
    // const signature = request.headers.get('resend-signature');
    // if (!signature) {
    //   return NextResponse.json({ error: 'No signature provided' }, { status: 401 });
    // }
    
    // Parse the webhook payload
    const payload = await request.json() as ResendWebhookEvent;
    const { type, data } = payload;
    
    // Initialize Supabase client
    const supabase = createAdminClient();
    
    // Extract the recipient email (first in the to array)
    const recipientEmail = data.to[0];
    
    // Extract event type from the webhook type
    const eventType = type.replace('email.', '');
    
    // Convert tags array to a more usable object
    const tagsObject: Record<string, string> = {};
    if (data.tags && Array.isArray(data.tags)) {
      data.tags.forEach(tag => {
        tagsObject[tag.name] = tag.value;
      });
    }
    
    // Extract email type from tags if available
    const emailType = tagsObject.email_type || 'unknown';
    
    // Create metadata object based on event type
    let metadata: Record<string, any> = {
      ...tagsObject,
      timestamp: new Date().toISOString()
    };
    
    if (type === 'email.clicked' && data.click) {
      metadata = {
        ...metadata,
        ...data.click
      };
    }
    
    // Store the event in the email_events table
    const { error: insertError } = await supabase
      .from('email_events')
      .insert({
        email_id: data.email_id,
        recipient_email: recipientEmail,
        event_type: eventType,
        subject: data.subject,
        email_type: emailType,
        metadata
      });
      
    if (insertError) {
      console.error('Error inserting email event:', insertError);
    }
    
    // Process different event types for beta_invites table
    if (emailType === 'beta_invite') {
      switch (type) {
        case 'email.opened':
          // Update beta_invites table if the email is opened
          const { error: openedError } = await supabase
            .from('beta_invites')
            .update({ opened_at: new Date().toISOString() })
            .eq('email', recipientEmail)
            .is('opened_at', null);
            
          if (openedError) {
            console.error('Error updating opened_at:', openedError);
          }
          break;
          
        case 'email.clicked':
          // Update beta_invites table if a link in the email is clicked
          const { error: clickedError } = await supabase
            .from('beta_invites')
            .update({ clicked_at: new Date().toISOString() })
            .eq('email', recipientEmail)
            .is('clicked_at', null);
            
          if (clickedError) {
            console.error('Error updating clicked_at:', clickedError);
          }
          break;
      }
    }
    
    // Log the event for debugging
    console.log(`Email event: ${type} for ${recipientEmail} (${emailType})`);
    
    // Return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
