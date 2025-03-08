/// <reference lib="deno.ns" />

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.URL;
const supabaseKey = process.env.ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

Deno.serve(async (req) => {
  const payload = await req.json();
  const { record, type } = payload;

  if (type === 'INSERT' && record && record.id) {
    // User was created, send webhook
    const webhookUrl = process.env.WEBHOOK_URL;
    const webhookPayload = {
      event: 'user.created',
      user: record,
    };

    try {
      const response = await fetch(webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      console.log('Webhook sent successfully');
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error sending webhook:', error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
