import { getPayload } from 'payload'
import config from '@/payload.config'
import { GearDecoration, ProjectCard } from '../components'

export const metadata = {
  title: 'Projects | CSME Concordia',
  description: 'Explore the innovative projects undertaken by CSME Concordia members - from competition vehicles to research initiatives.',
}

export default async function ProjectsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-createdAt',
    limit: 50,
  })

  // Group projects by status
  const ongoingProjects = projects.filter(p => p.status === 'ongoing')
  const upcomingProjects = projects.filter(p => p.status === 'upcoming')
  const completedProjects = projects.filter(p => p.status === 'completed')

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
              Our Projects
            </span>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Engineering
              <span className="text-navy"> Innovation</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Discover the projects our members are working on - from competition
              vehicles to cutting-edge research. Each project offers hands-on
              experience and the opportunity to make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Sections */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-navy rounded-full animate-pulse" />
                <h2
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Ongoing Projects
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ongoingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Projects */}
          {upcomingProjects.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <h2
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Upcoming Projects
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h2
                  className="text-3xl font-bold text-slate-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Completed Projects
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-8">
                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                No Projects Yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                We're working on exciting new projects. Check back soon or contact us
                to learn about upcoming opportunities!
              </p>
              <a href="/contact" className="btn-primary">
                Get Involved
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

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
            Have a Project Idea?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            We're always looking for new projects and ideas. If you have a concept
            you'd like to explore, we'd love to hear from you.
          </p>
          <a href="/contact" className="btn-accent">
            Submit Your Idea
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
