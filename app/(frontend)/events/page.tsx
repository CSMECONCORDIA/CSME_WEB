import { getPayload } from 'payload'
import config from '@/payload.config'
import { GearDecoration, EventCard } from '../components'

export const metadata = {
  title: 'Events | CSME Concordia',
  description: 'Stay up to date with CSME Concordia events - workshops, networking nights, competitions, and more.',
}

export default async function EventsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const now = new Date().toISOString()

  // Fetch upcoming events
  const { docs: upcomingEvents } = await payload.find({
    collection: 'events',
    where: {
      date: { greater_than: now }
    },
    sort: 'date',
    limit: 50,
  })

  // Fetch past events
  const { docs: pastEvents } = await payload.find({
    collection: 'events',
    where: {
      date: { less_than: now }
    },
    sort: '-date',
    limit: 20,
  })

  const featuredUpcoming = upcomingEvents.find(e => e.featured) || upcomingEvents[0]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 text-navy/5">
          <GearDecoration size={600} spin />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-navy font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Events
            </span>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Connect &
              <span className="text-navy"> Grow</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              From technical workshops to industry networking nights, our events
              provide opportunities to learn, connect, and advance your career
              in mechanical engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Event */}
      {featuredUpcoming && (
        <section className="py-16 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-white/5">
            <GearDecoration size={400} spin />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent font-medium uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Featured Event
              </span>
            </div>

            <div className="bg-white">
              <EventCard event={featuredUpcoming} variant="featured" />
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <h2
              className="text-3xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Upcoming Events
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No Upcoming Events
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We're planning exciting new events. Follow us on social media or
                subscribe to stay updated!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-3 h-3 bg-slate-400 rounded-full" />
              <h2
                className="text-3xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Past Events
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-6 border border-slate-200 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 flex-shrink-0 bg-slate-100 text-slate-600 flex flex-col items-center justify-center p-3">
                      <span className="text-xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs uppercase tracking-wider mt-1">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold text-slate-900 mb-1"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Don't Miss Out
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Stay connected with CSME Concordia. Be the first to know about our
            upcoming events, workshops, and networking opportunities.
          </p>
          <a href="/contact" className="btn-accent">
            Contact Us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
