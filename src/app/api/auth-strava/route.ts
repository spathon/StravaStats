import { redirect } from 'next/navigation'

export const runtime = 'edge'

export function GET() {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID || '',
    redirect_uri: process.env.STRAVA_REDIRECT_URL || '',
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  })

  redirect(`https://www.strava.com/oauth/authorize?${params.toString()}`)
}
