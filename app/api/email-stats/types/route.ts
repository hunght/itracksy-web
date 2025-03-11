import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createAdminClient();

    // Query distinct email types
    const { data, error } = await supabase
      .from('email_events')
      .select('email_type')
      .not('email_type', 'is', null)
      .order('email_type');
    if (error) {
      console.error('Error fetching email types:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email types' },
        { status: 500 },
      );
    }

    // Extract the types from the data
    const types = data.map((item) => item.email_type);

    // Return the types
    return NextResponse.json({ types });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
