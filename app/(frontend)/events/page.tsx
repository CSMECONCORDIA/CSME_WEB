import { getPayload } from 'payload'
import config from '@/payload.config'
import { EventCard } from '../components'
import {
  EventsHero,
  FeaturedEventSection,
  UpcomingEventsSection,
  EventCardWrapper,
  PastEventsSection,
  EventsCTA,
} from './EventsContent'

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
      <EventsHero />

      {/* Featured Upcoming Event */}
      {featuredUpcoming && (
        <FeaturedEventSection>
          <EventCard event={featuredUpcoming} variant="featured" />
        </FeaturedEventSection>
      )}

      {/* Upcoming Events */}
      <UpcomingEventsSection isEmpty={upcomingEvents.length === 0}>
        {upcomingEvents.map((event) => (
          <EventCardWrapper key={event.id}>
            <EventCard event={event} />
          </EventCardWrapper>
        ))}
      </UpcomingEventsSection>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <PastEventsSection
          events={pastEvents.map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            location: e.location,
          }))}
        />
      )}

      <EventsCTA />
    </div>
  )
}
