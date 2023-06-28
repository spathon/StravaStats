type StravaActivity = {
  id: number
  start_date: string
  type: string
  name: string
  total_elevation_gain: number
  distance: number
}

type StravaAthlete = {
  id: number
  username: string
  city: string
  country: string
  profile_medium: string
}

type StravaTokenResp = {
  access_token: string
  status: number
  athlete: StravaAthlete
}

type AppUser = StravaAthlete & {
  activities: StravaActivity[]
}

type WeekActivity = {
  name: string
  startDate: Date
  elevation: number
  distance: number
}

type Week = {
  weekNr: number
  total: number
  activities: WeekActivity[]
}

type WeekTipProps = {
  payload?: {
    name: string
    value: number
    payload: Week
  }[]
  measure: 'km' | 'm'
}

type MesureType = 'distance' | 'elevation'
type TimeType = 'weeks' | 'months'
