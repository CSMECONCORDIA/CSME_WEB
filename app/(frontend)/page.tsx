import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { GearDecoration, ProjectCard, EventCard } from './components'

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
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        {/* Background Decorations */}
        <div className="absolute top-20 right-0 text-navy opacity-10">
          <GearDecoration size={500} spin />
        </div>
        <div className="absolute bottom-0 left-0 text-navy opacity-5">
          <GearDecoration size={350} spin reverse />
        </div>

        {/* Technical Lines */}
        <div className="absolute top-1/3 left-0 w-1/4 h-px bg-gradient-to-r from-transparent via-navy/20 to-transparent" />
        <div className="absolute top-2/3 right-0 w-1/3 h-px bg-gradient-to-l from-transparent via-navy/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="opacity-0 animate-slide-left">
              <div className="hero-subtitle text-navy mb-4">
                Canadian Society for Mechanical Engineering
              </div>
              <h1 className="hero-title text-slate-900 mb-6">
                Engineering
                <span className="block text-navy">Tomorrow's</span>
                Solutions
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                At Concordia University, we connect aspiring engineers with industry,
                foster innovation through hands-on projects, and build a community
                that shapes the future of mechanical engineering.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="btn-primary">
                  Explore Projects
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/about" className="btn-outline">
                  About Us
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-slate-200">
                <div className="opacity-0 animate-fade-up delay-200">
                  <div className="text-4xl font-bold text-navy" style={{ fontFamily: 'var(--font-display)' }}>50+</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Active Members</div>
                </div>
                <div className="opacity-0 animate-fade-up delay-300">
                  <div className="text-4xl font-bold text-navy" style={{ fontFamily: 'var(--font-display)' }}>12+</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Projects</div>
                </div>
                <div className="opacity-0 animate-fade-up delay-400">
                  <div className="text-4xl font-bold text-navy" style={{ fontFamily: 'var(--font-display)' }}>20+</div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider mt-1">Events/Year</div>
                </div>
              </div>
            </div>

            {/* Logo/Image */}
            <div className="relative opacity-0 animate-slide-right delay-200">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Technical frame */}
                <div className="absolute inset-4 border-2 border-navy/20" />
                <div className="absolute inset-8 border border-navy/10" />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-navy" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-navy" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-navy" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-navy" />

                {/* Logo */}
                <div className="absolute inset-12 flex items-center justify-center bg-white shadow-2xl p-8">
                  <Image
                    src="/cropped-CSME-small-logo-acronym-text-2-1024x517.jpg"
                    alt="CSME Concordia University"
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Featured Event Section */}
      {featuredEvent && (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-white/5">
            <GearDecoration size={400} spin />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent font-medium uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                Next Event
              </span>
            </div>

            <div className="bg-white">
              <EventCard event={featuredEvent} variant="featured" />
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="text-navy font-medium uppercase tracking-wider text-sm mb-2 block" style={{ fontFamily: 'var(--font-display)' }}>
                Our Work
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="btn-outline self-start lg:self-auto"
            >
              View All Projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-slate-500">No featured projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute -right-20 -bottom-20 text-white/5">
          <GearDecoration size={400} spin reverse />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join CSME Concordia and become part of a community that's shaping
            the next generation of mechanical engineering.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-accent">
              Join CSME Today
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/events" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events List */}
      {upcomingEvents.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <span className="text-navy font-medium uppercase tracking-wider text-sm mb-2 block" style={{ fontFamily: 'var(--font-display)' }}>
                  Stay Connected
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                  Upcoming Events
                </h2>
              </div>
              <Link
                href="/events"
                className="btn-outline self-start lg:self-auto"
              >
                View All Events
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
