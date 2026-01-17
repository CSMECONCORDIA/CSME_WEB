import {
  AboutHero,
  MissionSection,
  ValuesSection,
  HistorySection,
  AboutCTA,
} from './AboutContent'

export const metadata = {
  title: 'About Us | CSME Concordia',
  description: 'Learn about the Canadian Society for Mechanical Engineering - Concordia Chapter. Our mission, values, and team.',
}

export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <MissionSection />
      <ValuesSection />
      <HistorySection />
      <AboutCTA />
    </div>
  )
}
