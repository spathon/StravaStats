import { redirect } from '@remix-run/node'


export async function loader() {
  const params = new URLSearchParams({
    client_id: process.env.STRAVA_CLIENT_ID,
    redirect_uri: process.env.STRAVA_REDIRECT_URL,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  })

  return redirect(`https://www.strava.com/oauth/authorize?${params}`)
}
