'use client'

import { getWeek, getMonth } from 'date-fns'
import { useState } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'

const colors = ['#5dcafa', '#82ca9d', '#8884d8', '#18f4d8', '#5584f8', '#ff5f6b']
const stacks = Array(50)
  .fill('')
  .map((val, index) => ({
    key: `stack${index}`,
    color: colors[index % colors.length],
  }))

const getColor = (index: number) => stacks[index]?.color || ''

function Gradient({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
      <stop offset="95%" stopColor={color} stopOpacity={0.5} />
    </linearGradient>
  )
}

function WeekTip({ payload, measure }: WeekTipProps) {
  return (
    <div className="weektip">
      <table className="table">
        <tbody>
          {payload
            ?.filter((bar) => bar.value > 0)
            ?.map((bar, index) => (
              <tr key={bar.name} className="weektip__activity" style={{ color: getColor(index) }}>
                <td className="activity_name">{bar?.payload?.activities?.[index]?.name}</td>
                <td>
                  {bar.value}
                  <span className="meta"> {measure}</span>
                </td>
              </tr>
            ))
            ?.reverse()}
          <tr>
            <th>Total</th>
            <th className="weektip__total">
              {payload?.[0]?.payload?.total}
              <span className="meta"> {measure}</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function MyBar({ weeks, type }: { weeks: Week[]; type: MesureType }) {
  const measure = type === 'elevation' ? 'm' : 'km'

  return (
    <ResponsiveContainer height={350}>
      <BarChart barCategoryGap="1%" data={weeks}>
        <defs>
          {stacks.map(({ key, color }) => (
            <Gradient key={key} id={key} color={color} />
          ))}
        </defs>
        <XAxis dataKey="weekNr" />
        <CartesianGrid strokeDasharray="1 3" />
        <YAxis tickFormatter={(val: number) => `${val} ${measure}`} />
        <Tooltip cursor={{ opacity: 0.2 }} content={<WeekTip measure={measure} />} />
        {stacks.map(({ key }, index) => (
          <Bar
            key={key}
            dataKey={(payload: Week) => payload?.activities?.[index]?.[type] || 0}
            stackId="a"
            fill={`url(#${key})`}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function Activities({ activities }: { activities: StravaActivity[] }) {
  const [type, setType] = useState<MesureType>('elevation')
  const [time, setTime] = useState<TimeType>('weeks')
  const [sports, setSports] = useState(['Run', 'Hike', 'BackcountrySki'])
  const isWeeks = time === 'weeks'
  const today = new Date()

  const thisWeek = isWeeks ? getWeek(new Date(), { weekStartsOn: 1 }) : getMonth(new Date()) + 1
  const weeks: Week[] = Array(thisWeek)
    .fill({})
    .map((val, index) => ({
      weekNr: index + 1,
      total: 0,
      activities: [],
    }))

  const allSports = [...new Set(activities.map((event) => event.type))]

  activities
    .filter((event) => new Date(event.start_date).getFullYear() === today.getFullYear())
    .filter((event) => sports.includes(event.type) || sports.length === 0)
    // .filter((event) => event.total_elevation_gain > 100 && event.total_elevation_gain < 3000)
    .map((event) => ({
      name: event.name,
      startDate: new Date(event.start_date),
      elevation: Math.round(event.total_elevation_gain),
      distance: Math.round((event.distance / 1000 + Number.EPSILON) * 10) / 10,
    }))
    .forEach((event) => {
      const weekNr = isWeeks
        ? getWeek(event.startDate, { weekStartsOn: 1 })
        : getMonth(event.startDate) + 1
      const week = weeks.find((w) => w.weekNr === weekNr)
      if (!week) return
      week.activities.unshift(event)
      week.total += event[type]
    })

  return (
    <div className="page page--wide">
      <h1 className="text-center">Activities {type}</h1>

      <div className="options">
        <div className="select-type">
          <label>
            <input
              type="radio"
              checked={time === 'weeks'}
              name="time"
              value="weeks"
              onChange={() => setTime('weeks')}
            />{' '}
            Weeks
          </label>{' '}
          <label>
            <input
              type="radio"
              checked={time === 'months'}
              name="time"
              value="months"
              onChange={() => setTime('months')}
            />{' '}
            Months
          </label>
        </div>

        <div className="select-type">
          <label>
            <input
              type="radio"
              checked={type === 'elevation'}
              name="type"
              onChange={() => setType('elevation')}
            />{' '}
            Elevation
          </label>{' '}
          <label>
            <input
              type="radio"
              checked={type === 'distance'}
              name="type"
              onChange={() => setType('distance')}
            />{' '}
            Distance
          </label>
        </div>
      </div>

      <MyBar weeks={weeks} type={type} />

      <hr />

      <div>
        <h2>Filer sports</h2>
        <div className="select-type">
          {allSports.map((type: string) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={sports.includes(type)}
                onChange={() =>
                  setSports((prev) => {
                    if (prev.includes(type)) return prev.filter((sport) => sport !== type)
                    return [...prev, type]
                  })
                }
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
