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
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // Build the query
    let query = supabase
      .from('email_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply filters if provided
    if (emailType) {
      query = query.eq('email_type', emailType);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      // Add one day to include the end date fully
      const endDateObj = new Date(endDate);
      endDateObj.setDate(endDateObj.getDate() + 1);
      query = query.lt('created_at', endDateObj.toISOString());
    }
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching email events:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email events' },
        { status: 500 }
      );
    }
    
    // Return the events
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
