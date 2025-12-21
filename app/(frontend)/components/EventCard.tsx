import Image from 'next/image'
import Link from 'next/link'
import type { Event, Media } from '@/payload-types'

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  return {
    day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
}

function isUpcoming(dateString: string) {
  return new Date(dateString) > new Date()
}

export function EventCard({ event, variant = 'default' }: { event: Event; variant?: 'default' | 'featured' }) {
  const thumbnail = event.thumbnail as Media | null
  const hasImage = thumbnail?.url
  const eventDate = formatEventDate(event.date)
  const upcoming = isUpcoming(event.date)

  if (variant === 'featured') {
    return (
      <Link href={`/events/${event.slug}`} className="block">
        <article className="group card-hover bg-white border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 md:h-auto bg-slate-100 overflow-hidden">
              {hasImage ? (
                <Image
                  src={thumbnail.url!}
                  alt={thumbnail.alt || event.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/10 to-navy/5">
                  <svg className="w-20 h-20 text-navy/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Date Badge */}
              <div className="absolute top-4 left-4 bg-navy text-white p-3 text-center min-w-[70px]">
                <span className="block text-2xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {eventDate.day}
                </span>
                <span className="block text-xs uppercase tracking-wider mt-1">
                  {eventDate.month}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              {upcoming && (
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-3">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Upcoming Event
                </span>
              )}
              <h3
                className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-navy transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {event.title}
              </h3>

              <div className="space-y-3 text-slate-600 mb-6">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{eventDate.full} at {eventDate.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {event.registrationLink && upcoming && (
                  <span className="btn-primary">
                    Register Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                )}
                <span className="btn-outline">
                  Learn More
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <article className="group card-hover bg-white border border-slate-200 overflow-hidden flex">
        {/* Date Column */}
        <div className="w-24 flex-shrink-0 bg-navy text-white flex flex-col items-center justify-center p-4">
          <span className="text-3xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {eventDate.day}
          </span>
          <span className="text-sm uppercase tracking-wider mt-1 opacity-80">
            {eventDate.month}
          </span>
          <span className="text-xs opacity-60 mt-1">
            {eventDate.year}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          {upcoming && (
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent mb-2">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Upcoming
            </span>
          )}
          <h3
            className="text-lg font-bold text-slate-900 mb-2 group-hover:text-navy transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {eventDate.time}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center pr-5">
          <svg
            className="w-5 h-5 text-slate-400 group-hover:text-navy group-hover:translate-x-1 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  )
}
