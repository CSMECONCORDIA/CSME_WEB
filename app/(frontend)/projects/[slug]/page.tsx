import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { GearDecoration } from '../../components'
import type { Media } from '@/payload-types'

// Lexical rich text types
interface LexicalTextNode {
  text?: string
  type?: string
  children?: LexicalTextNode[]
}

interface LexicalNode {
  type: string
  tag?: number
  listType?: string
  children?: LexicalNode[] | LexicalTextNode[]
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const project = docs[0]

  if (!project) {
    return { title: 'Project Not Found | CSME Concordia' }
  }

  return {
    title: `${project.title} | CSME Concordia Projects`,
    description: `Learn about ${project.title} - a ${project.status} project by CSME Concordia.`,
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'ongoing':
      return 'badge-ongoing'
    case 'completed':
      return 'badge-completed'
    case 'upcoming':
      return 'badge-upcoming'
    default:
      return 'badge-ongoing'
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const project = docs[0]

  if (!project) {
    notFound()
  }

  const thumbnail = project.thumbnail as Media | null

  // Fetch related projects (same status, excluding current)
  const { docs: relatedProjects } = await payload.find({
    collection: 'projects',
    where: {
      and: [
        { status: { equals: project.status } },
        { id: { not_equals: project.id } },
      ],
    },
    limit: 3,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 text-navy/5">
          <GearDecoration size={500} spin />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link href="/" className="hover:text-navy transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/projects" className="hover:text-navy transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-slate-900 font-medium truncate max-w-[200px]">
                {project.title}
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <div>
              <div className="mb-4">
                <span className={`badge ${getStatusBadgeClass(project.status || 'ongoing')}`}>
                  {project.status || 'Ongoing'}
                </span>
              </div>

              <h1
                className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {project.title}
              </h1>

              {/* Date Range */}
              {(project.startDate || project.endDate) && (
                <div className="flex items-center gap-3 text-slate-600 mb-6">
                  <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                    {project.startDate && !project.endDate && ' - Present'}
                  </span>
                </div>
              )}

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div className="mb-8">
                  <h3
                    className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Team Members
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 bg-white border border-slate-200 text-sm"
                      >
                        <span className="font-medium text-slate-900">{member.name}</span>
                        {member.role && (
                          <span className="text-slate-500 ml-2">• {member.role}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-4">
                <Link href="/contact" className="btn-primary">
                  Get Involved
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/projects" className="btn-outline">
                  All Projects
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                {thumbnail?.url ? (
                  <Image
                    src={thumbnail.url}
                    alt={thumbnail.alt || project.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/10 to-navy/5">
                    <svg className="w-24 h-24 text-navy/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                )}
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-navy" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-navy" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-navy" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-navy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {project.description && (
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2
              className="text-3xl font-bold text-slate-900 mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              About This Project
            </h2>
            <div className="prose prose-lg text-slate-600 leading-relaxed">
              {/* Render rich text description */}
              {typeof project.description === 'object' && project.description.root?.children?.map((node: LexicalNode, index: number) => {
                if (node.type === 'paragraph') {
                  const text = (node.children as LexicalTextNode[])?.map((child) => child.text || '').join('') || ''
                  return text ? <p key={index}>{text}</p> : null
                }
                if (node.type === 'heading') {
                  const text = (node.children as LexicalTextNode[])?.map((child) => child.text || '').join('') || ''
                  const Tag = `h${node.tag || 3}` as keyof JSX.IntrinsicElements
                  return <Tag key={index} className="text-slate-900 font-bold mt-8 mb-4">{text}</Tag>
                }
                if (node.type === 'list') {
                  const ListTag = node.listType === 'number' ? 'ol' : 'ul'
                  return (
                    <ListTag key={index} className="list-disc list-inside space-y-2">
                      {(node.children as LexicalNode[])?.map((item, itemIndex: number) => {
                        const text = (item.children as LexicalTextNode[])?.map((child) =>
                          child.children?.map((c) => c.text || '').join('') || child.text || ''
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

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2
                className="text-3xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Related Projects
              </h2>
              <Link href="/projects" className="btn-outline">
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => {
                const relatedThumbnail = relatedProject.thumbnail as Media | null
                return (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.slug}`}
                    className="group card-hover bg-white border border-slate-200 overflow-hidden"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {relatedThumbnail?.url ? (
                        <Image
                          src={relatedThumbnail.url}
                          alt={relatedThumbnail.alt || relatedProject.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/10 to-navy/5">
                          <svg className="w-12 h-12 text-navy/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <span className={`badge ${getStatusBadgeClass(relatedProject.status || 'ongoing')} mb-3`}>
                        {relatedProject.status || 'Ongoing'}
                      </span>
                      <h3
                        className="text-xl font-bold text-slate-900 group-hover:text-navy transition-colors"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {relatedProject.title}
                      </h3>
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
            Want to Join This Project?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            We&apos;re always looking for passionate students to join our project teams.
            Get hands-on experience and make a real impact.
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
