import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  ExplodedViewScene,
  ProjectCard,
  EventCard,
  AnimatedSectionHeader,
  AnimatedCardsGrid,
  AnimatedCard,
  AnimatedCTASection,
  AnimatedFeaturedEvent,
  AnimatedEventsList,
} from './components'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch featured projects
  const { docs: featuredProjects } = await payload.find({
    collection: 'projects',
    where: { featured: { equals: true } },
    limit: 3,
    sort: '-createdAt',
  })

  // Fetch upcoming events
  const { docs: upcomingEvents } = await payload.find({
    collection: 'events',
    where: {
      date: { greater_than: new Date().toISOString() }
    },
    limit: 3,
    sort: 'date',
  })

  // Get the next featured event
  const featuredEvent = upcomingEvents.find(e => e.featured) || upcomingEvents[0]

  return (
    <div className="relative">
      {/* Exploded View Hero Section */}
      <ExplodedViewScene />

      {/* Featured Event Section */}
      {featuredEvent && (
        <AnimatedFeaturedEvent>
          <EventCard event={featuredEvent} variant="featured" />
        </AnimatedFeaturedEvent>
      )}

      {/* Featured Projects Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSectionHeader
            subtitle="Our Work"
            title="Featured Projects"
            linkHref="/projects"
            linkText="View All Projects"
          />

          {featuredProjects.length > 0 ? (
            <AnimatedCardsGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <AnimatedCard key={project.id}>
                  <ProjectCard project={project} />
                </AnimatedCard>
              ))}
            </AnimatedCardsGrid>
          ) : (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700">
              <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-slate-500 dark:text-slate-400">No featured projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedCTASection
        title="Ready to Build the Future?"
        description="Join CSME Concordia and become part of a community that's shaping the next generation of mechanical engineering."
        primaryLink={{ href: '/contact', text: 'Join CSME Today' }}
        secondaryLink={{ href: '/events', text: 'View Events' }}
      />

      {/* Upcoming Events List */}
      {upcomingEvents.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <AnimatedSectionHeader
              subtitle="Stay Connected"
              title="Upcoming Events"
              linkHref="/events"
              linkText="View All Events"
            />

            <AnimatedEventsList>
              {upcomingEvents.slice(0, 3).map((event) => (
                <AnimatedCard key={event.id}>
                  <EventCard event={event} />
                </AnimatedCard>
              ))}
            </AnimatedEventsList>
          </div>
        </section>
      )}
    </div>
  )
}
