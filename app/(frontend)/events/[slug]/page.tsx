import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { GearDecoration } from '../../components'
import type { Media } from '@/payload-types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const event = docs[0]

  if (!event) {
    return { title: 'Event Not Found | CSME Concordia' }
  }

  return {
    title: `${event.title} | CSME Concordia Events`,
    description: `Join us for ${event.title} at CSME Concordia.`,
  }
}

function formatEventDate(dateString: string) {
  const date = new Date(dateString)
  return {
    day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    year: date.toLocaleDateString('en-US', { year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
}

function isUpcoming(dateString: string) {
  return new Date(dateString) > new Date()
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const event = docs[0]

  if (!event) {
    notFound()
  }

  const thumbnail = event.thumbnail as Media | null
  const eventDate = formatEventDate(event.date)
  const upcoming = isUpcoming(event.date)

  // Fetch other upcoming events
  const { docs: otherEvents } = await payload.find({
    collection: 'events',
    where: {
      and: [
        { date: { greater_than: new Date().toISOString() } },
        { id: { not_equals: event.id } },
      ],
    },
    sort: 'date',
    limit: 3,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 text-white/5">
          <GearDecoration size={500} spin />
        </div>
        <div className="absolute inset-0 grid-bg opacity-5" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium truncate max-w-[200px]">
                {event.title}
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              {upcoming && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-bold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Upcoming Event
                </div>
              )}

              <h1
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{eventDate.full}</p>
                    <p className="text-white/60 text-sm">at {eventDate.time}</p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-white/60 text-sm">Location</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                {event.registrationLink && upcoming && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent"
                  >
                    Register Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                <Link href="/events" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
                  All Events
                </Link>
              </div>
            </div>

            {/* Date Display */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white text-slate-900 p-8 text-center min-w-[200px]">
                <span className="block text-6xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {eventDate.day}
                </span>
                <span className="block text-2xl uppercase tracking-wider mt-2 text-navy">
                  {eventDate.month}
                </span>
                <span className="block text-lg text-slate-500 mt-1">
                  {eventDate.year}
                </span>
                <div className="w-16 h-1 bg-navy mx-auto mt-4" />
                <span className="block text-sm uppercase tracking-wider mt-4 text-slate-500">
                  {eventDate.weekday}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      {thumbnail?.url && (
        <section className="relative">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
            <div className="aspect-video bg-slate-200 relative overflow-hidden shadow-2xl">
              <Image
                src={thumbnail.url}
                alt={thumbnail.alt || event.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-navy" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-navy" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-navy" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-navy" />
            </div>
          </div>
        </section>
      )}

      {/* Description Section */}
      {event.description && (
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2
              className="text-3xl font-bold text-slate-900 mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About This Event
            </h2>
            <div className="prose prose-lg text-slate-600 leading-relaxed">
              {/* Render rich text description */}
              {typeof event.description === 'object' && event.description.root?.children?.map((node: any, index: number) => {
                if (node.type === 'paragraph') {
                  const text = node.children?.map((child: any) => child.text || '').join('') || ''
                  return text ? <p key={index}>{text}</p> : null
                }
                if (node.type === 'heading') {
                  const text = node.children?.map((child: any) => child.text || '').join('') || ''
                  const Tag = `h${node.tag || 3}` as keyof JSX.IntrinsicElements
                  return <Tag key={index} className="text-slate-900 font-bold mt-8 mb-4">{text}</Tag>
                }
                if (node.type === 'list') {
                  const ListTag = node.listType === 'number' ? 'ol' : 'ul'
                  return (
                    <ListTag key={index} className="list-disc list-inside space-y-2">
                      {node.children?.map((item: any, itemIndex: number) => {
                        const text = item.children?.map((child: any) =>
                          child.children?.map((c: any) => c.text || '').join('') || child.text || ''
                        ).join('') || ''
                        return <li key={itemIndex}>{text}</li>
                      })}
                    </ListTag>
                  )
                }
                return null
              })}
            </div>
          </div>
        </section>
      )}

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2
                className="text-3xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Other Upcoming Events
              </h2>
              <Link href="/events" className="btn-outline">
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {otherEvents.map((otherEvent) => {
                const otherDate = formatEventDate(otherEvent.date)
                return (
                  <Link
                    key={otherEvent.id}
                    href={`/events/${otherEvent.slug}`}
                    className="group bg-white border border-slate-200 overflow-hidden card-hover"
                  >
                    <div className="flex">
                      <div className="w-20 flex-shrink-0 bg-navy text-white flex flex-col items-center justify-center p-4">
                        <span className="text-2xl font-bold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                          {otherDate.day}
                        </span>
                        <span className="text-xs uppercase tracking-wider mt-1 opacity-80">
                          {otherDate.month}
                        </span>
                      </div>
                      <div className="flex-1 p-4">
                        <h3
                          className="font-bold text-slate-900 group-hover:text-navy transition-colors mb-1"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {otherEvent.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {otherDate.time}
                          {otherEvent.location && ` • ${otherEvent.location}`}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="absolute -right-20 -bottom-20 text-white/5">
          <GearDecoration size={400} spin reverse />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Don't Miss Out
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Stay connected with CSME Concordia and be the first to know about our events.
          </p>
          <Link href="/contact" className="btn-accent">
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
