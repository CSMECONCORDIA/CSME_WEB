import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProjectCard } from '../components'
import {
  ProjectsHero,
  ProjectsSection,
  ProjectCardWrapper,
  ProjectsEmptyState,
  ProjectsCTA,
} from './ProjectsContent'

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
      <ProjectsHero />

      {/* Projects Sections */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <ProjectsSection title="Ongoing Projects" statusColor="bg-navy">
              {ongoingProjects.map((project) => (
                <ProjectCardWrapper key={project.id}>
                  <ProjectCard project={project} />
                </ProjectCardWrapper>
              ))}
            </ProjectsSection>
          )}

          {/* Upcoming Projects */}
          {upcomingProjects.length > 0 && (
            <ProjectsSection title="Upcoming Projects" statusColor="bg-yellow-500">
              {upcomingProjects.map((project) => (
                <ProjectCardWrapper key={project.id}>
                  <ProjectCard project={project} />
                </ProjectCardWrapper>
              ))}
            </ProjectsSection>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <ProjectsSection title="Completed Projects" statusColor="bg-green-500">
              {completedProjects.map((project) => (
                <ProjectCardWrapper key={project.id}>
                  <ProjectCard project={project} />
                </ProjectCardWrapper>
              ))}
            </ProjectsSection>
          )}

          {/* Empty State */}
          {projects.length === 0 && <ProjectsEmptyState />}
        </div>
      </section>

      <ProjectsCTA />
    </div>
  )
}
