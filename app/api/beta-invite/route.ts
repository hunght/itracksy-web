import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/server';
import { sendBetaInviteEmail } from '@/app/services/email';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (
      user.email !== 'hunghero321@gmail.com' &&
      user.email !== 'hth321@gmail.com' &&
      user.email !== 'pvhieu30@gmail.com'
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 },
      );
    }

    // Parse request body
    const { email, name, leadId, inviteMessage } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    // check if email already sent to user
    const { data: existingInvite } = await supabase
      .from('beta_invites')
      .select('id')
      .eq('email', email)
      .single();

    if (existingInvite) {
      return NextResponse.json({
        success: false,
        message: 'Invite has already been sent to this email.',
      });
    }

    // Send the invitation email
    const emailResult = await sendBetaInviteEmail({
      userEmail: email,
      recipientName: name,
    });

    if (!emailResult?.success) {
      // Even if email fails, we return success since the invite was created
      return NextResponse.json({
        success: true,

        emailSent: false,
        message: 'Beta invite created but email failed to send',
      });
    }

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
