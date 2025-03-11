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
    
    // Group by event type
    const { data: eventStats, error: eventError } = await query.group('event_type');
    
    if (eventError) {
      console.error('Error fetching email event stats:', eventError);
      return NextResponse.json(
        { error: 'Failed to fetch email statistics' },
        { status: 500 }
      );
    }
    
    // Get total emails sent
    const { count: totalSent, error: countError } = await supabase
      .from('email_events')
      .select('*', { count: 'exact' })
      .eq('event_type', 'sent');
      
    if (countError) {
      console.error('Error counting sent emails:', countError);
    }
    
    // Calculate open and click rates
    const openCount = eventStats.find(stat => stat.event_type === 'opened')?.count || 0;
    const clickCount = eventStats.find(stat => stat.event_type === 'clicked')?.count || 0;
    
    const openRate = totalSent ? (openCount / totalSent) * 100 : 0;
    const clickRate = totalSent ? (clickCount / totalSent) * 100 : 0;
    const clickThroughRate = openCount ? (clickCount / openCount) * 100 : 0;
    
    // Return the statistics
    return NextResponse.json({
      totalSent,
      eventStats,
      rates: {
        openRate: parseFloat(openRate.toFixed(2)),
        clickRate: parseFloat(clickRate.toFixed(2)),
        clickThroughRate: parseFloat(clickThroughRate.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
