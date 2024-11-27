import { kv } from '@vercel/kv';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

function sendResponse(str: string) {
  return new Response(str, { status: 500 });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return sendResponse("Ah ah ah, you didn't say the magic word");

  const userBlob = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!userBlob.ok || userBlob.status !== 200)
    return sendResponse('Could not get user');
  const userResp = (await userBlob.json()) as StravaTokenResp;

  const resp = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=100',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userResp.access_token}`,
      },
    },
  );
  if (!userBlob.ok || userBlob.status !== 200) {
    return sendResponse('You need to approve activities to use this app');
  }
  const activities = (await resp.json()) as StravaActivity[];

  const user = {
    id: userResp.athlete.id,
    username: userResp.athlete.username,
    city: userResp.athlete.city,
    country: userResp.athlete.country,
    profile_medium: userResp.athlete.profile_medium,
    activities,
  };

  const userUuid = crypto.randomUUID();
  const fiveDays = 5 * 24 * 60 * 60;
  await kv.set(`user:${userUuid}`, JSON.stringify(user), { ex: fiveDays });

  const cookieStore = await cookies();
  cookieStore.set({
    name: 'user',
    value: `${userUuid}`,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  redirect('/');
}
