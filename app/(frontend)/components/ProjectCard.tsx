import Image from 'next/image'
import Link from 'next/link'
import type { Project, Media } from '@/payload-types'

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

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail = project.thumbnail as Media | null
  const hasImage = thumbnail?.url

  return (
    <article className="group card-hover bg-white border border-slate-200 overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {hasImage ? (
          <Image
            src={thumbnail.url!}
            alt={thumbnail.alt || project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy/10 to-navy/5">
            <svg className="w-16 h-16 text-navy/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`badge ${getStatusBadgeClass(project.status || 'ongoing')}`}>
            {project.status || 'Ongoing'}
          </span>
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-medium uppercase tracking-wider text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            View Project
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="text-xl font-bold text-slate-900 mb-2 group-hover:text-navy transition-colors"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {project.title}
        </h3>

        {/* Date Range */}
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
              {project.startDate && !project.endDate && ' - Present'}
            </span>
          </div>
        )}

        {/* Team Members */}
        {project.teamMembers && project.teamMembers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{project.teamMembers.length} team member{project.teamMembers.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Arrow Link */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm text-navy font-medium uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Learn More
          </span>
          <svg
            className="w-5 h-5 text-navy transform group-hover:translate-x-2 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </article>
  )
}
