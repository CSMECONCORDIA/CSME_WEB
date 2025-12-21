import Image from 'next/image'
import Link from 'next/link'
import { GearDecoration } from '../components'

const executives = [
  {
    name: 'Executive Team',
    role: 'Leadership',
    description: 'Meet our dedicated team of student leaders working to advance mechanical engineering at Concordia.',
  },
]

const values = [
  {
    title: 'Innovation',
    description: 'We push boundaries and explore new frontiers in mechanical engineering through hands-on projects and research.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Community',
    description: 'We build lasting connections between students, faculty, and industry professionals in the engineering community.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from academic pursuits to professional development.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Impact',
    description: 'We create meaningful impact through sustainable engineering solutions and community engagement.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export const metadata = {
  title: 'About Us | CSME Concordia',
  description: 'Learn about the Canadian Society for Mechanical Engineering at Concordia University - our mission, values, and team.',
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 text-navy/5">
          <GearDecoration size={600} spin />
        </div>
        <div className="absolute bottom-0 left-0 text-navy/5">
          <GearDecoration size={300} spin reverse />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-navy font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              About CSME
            </span>
            <h1
              className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Building the Future of
              <span className="text-navy"> Mechanical Engineering</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              The Canadian Society for Mechanical Engineering at Concordia University
              is a student-run organization dedicated to fostering innovation,
              professional development, and community among aspiring mechanical engineers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-navy font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
                Our Mission
              </span>
              <h2
                className="text-4xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Empowering the Next Generation of Engineers
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  CSME Concordia serves as a bridge between academic learning and
                  professional practice. We provide students with opportunities to
                  apply theoretical knowledge through practical projects, connect
                  with industry leaders, and develop essential soft skills.
                </p>
                <p>
                  Our chapter is part of the national CSME organization, which has
                  been supporting mechanical engineers across Canada for decades.
                  We carry forward this legacy by creating a vibrant community at
                  Concordia University.
                </p>
                <p>
                  Through workshops, networking events, design competitions, and
                  hands-on projects, we prepare our members to become leaders in
                  the field of mechanical engineering.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {/* Technical frame */}
                <div className="absolute inset-0 border-4 border-navy/10" />
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-navy -translate-x-2 -translate-y-2" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-navy translate-x-2 translate-y-2" />

                <div className="absolute inset-8 bg-white shadow-xl flex items-center justify-center">
                  <Image
                    src="/cropped-CSME-small-logo-acronym-text-2-1024x517.jpg"
                    alt="CSME Concordia"
                    fill
                    className="object-contain p-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="absolute -right-20 top-20 text-white/5">
          <GearDecoration size={400} spin />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-navy-light font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Our Values
            </span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What Drives Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white/10 backdrop-blur-sm p-8 border border-white/10 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="text-navy-light mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {value.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-navy font-medium uppercase tracking-wider text-sm mb-4 block" style={{ fontFamily: 'var(--font-display)' }}>
              Our Story
            </span>
            <h2
              className="text-4xl font-bold text-slate-900 mb-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              A Legacy of Engineering Excellence
            </h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-left">
              <p>
                The CSME Concordia chapter was established to bring together
                mechanical engineering students who share a passion for innovation
                and professional growth. Since our founding, we have grown into
                one of the most active engineering clubs on campus.
              </p>
              <p>
                Our members have gone on to work at leading companies in aerospace,
                automotive, energy, and manufacturing sectors. Many have also pursued
                advanced degrees and research positions at prestigious institutions
                around the world.
              </p>
              <p>
                We take pride in our diverse community that welcomes students from
                all backgrounds and experience levels. Whether you're a first-year
                student exploring your interests or a senior looking to refine your
                skills, CSME has something to offer you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Become a member of CSME Concordia and start your journey towards
            becoming a successful mechanical engineer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-accent">
              Get in Touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/events" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              View Our Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
