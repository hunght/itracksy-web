import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createAdminClient();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const emailType = searchParams.get('emailType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build the query
    let query = supabase
      .from('email_events')
      .select('event_type, count(*)', { count: 'exact' });

    // Apply filters if provided
    if (emailType) {
      query = query.eq('email_type', emailType);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Create base query for filtering
    const baseQuery = (eventType: string) => {
      let q = supabase
        .from('email_events')
        .select('*', { count: 'exact' })
        .eq('event_type', eventType);

      if (emailType) {
        q = q.eq('email_type', emailType);
      }

      if (startDate) {
        q = q.gte('created_at', startDate);
      }

      if (endDate) {
        q = q.lte('created_at', endDate);
      }

      return q;
    };

    // Get count for each event type
    const { count: sentCount, error: sentError } = await baseQuery('sent');
    const { count: openCount, error: openError } = await baseQuery('opened');
    const { count: clickCount, error: clickError } = await baseQuery('clicked');

    if (sentError || openError || clickError) {
      console.error(
        'Error fetching email stats:',
        sentError || openError || clickError,
      );
      return NextResponse.json(
        { error: 'Failed to fetch email statistics' },
        { status: 500 },
      );
    }

    // Calculate rates
    const openRate = sentCount ? (openCount ?? 0 / sentCount) * 100 : 0;
    const clickRate = sentCount ? (clickCount ?? 0 / sentCount) * 100 : 0;
    const clickThroughRate = openCount
      ? (clickCount ?? 0 / openCount) * 100
      : 0;

    // Return the statistics
    return NextResponse.json({
      totalSent: sentCount,
      eventCounts: {
        sent: sentCount,
        opened: openCount,
        clicked: clickCount,
      },
      rates: {
        openRate: parseFloat(openRate.toFixed(2)),
        clickRate: parseFloat(clickRate.toFixed(2)),
        clickThroughRate: parseFloat(clickThroughRate.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
