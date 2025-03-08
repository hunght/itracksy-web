import OpenAI from 'openai';

import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_TOKEN,
  baseURL: 'https://openrouter.ai/api/v1/',
});

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get('x-forwarded-for');
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, '1 d'),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `notescape_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  }

  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'meta-llama/llama-3-8b-instruct:free',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI writing assistant that continues existing text based on context from prior text. ' +
          'Give more weight/priority to the later characters than the beginning ones. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences. ' +
          'Use Markdown formatting when appropriate.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false, // Change this to false
    n: 1,
  });

  // Handle the non-streaming response
  const generatedText = response.choices[0].message.content;

  return new Response(generatedText, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
