import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendBetaInviteEmail } from '@/app/services/email';
import { randomUUID } from 'crypto';

// Generate a unique invite code
function generateInviteCode(): string {
  // Create a short, readable code using a UUID prefix
  const uuid = randomUUID().substring(0, 8);
  return `BETA-${uuid.toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (
      user.email !== 'hunghero321@gmail.com' &&
      user.email !== 'hth321@gmail.com'
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 },
      );
    }

    // Parse request body
    const {
      email,
      name,
      leadId,
      inviteMessage,
      expiryDays = 7,
    } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a unique invite code for email tracking
    const inviteCode = generateInviteCode();

    // Store the invite in the database
    const { data: invite, error: inviteError } = await supabase
      .from('beta_invites')
      .insert({
        email,
        name,
        lead_id: leadId,
        invite_message: inviteMessage || 'Join our beta program!',
        status: 'sent',
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Failed to create beta invite:', inviteError);
      return NextResponse.json(
        { error: 'Failed to create beta invite' },
        { status: 500 },
      );
    }

    // Send the invitation email
    const emailResult = await sendBetaInviteEmail({
      userEmail: email,
      recipientName: name,
      inviteCode,
      expiryDays,
    });

    if (!emailResult?.success) {
      // Even if email fails, we return success since the invite was created
      return NextResponse.json({
        success: true,
        invite,
        emailSent: false,
        message: 'Beta invite created but email failed to send',
      });
    }

    return NextResponse.json({
      success: true,
      invite,
      emailSent: true,
    });
  } catch (error) {
    console.error('Beta invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
