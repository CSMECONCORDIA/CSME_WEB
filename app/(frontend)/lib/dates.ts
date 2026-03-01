const EVENT_TIMEZONE = 'America/Toronto'

export function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  const tz = { timeZone: EVENT_TIMEZONE } as const
  return {
    day: date.toLocaleDateString('en-US', { day: 'numeric', ...tz }),
    month: date.toLocaleDateString('en-US', { month: 'short', ...tz }),
    year: date.toLocaleDateString('en-US', { year: 'numeric', ...tz }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', ...tz }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long', ...tz }),
    full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', ...tz }),
    short: date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', ...tz }),
  }
}

export function isUpcoming(dateString: string) {
  return new Date(dateString) > new Date()
}
