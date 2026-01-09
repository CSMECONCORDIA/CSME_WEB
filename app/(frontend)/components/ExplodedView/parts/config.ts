export type PartGeometry = 'gear' | 'shaft' | 'bearing' | 'housing' | 'plate'

export interface AssemblyPartConfig {
  id: string
  name: string
  description: string
  geometry: PartGeometry
  assembledPosition: [number, number, number]
  explodedPosition: [number, number, number]
  assembledRotation: [number, number, number]
  explodedRotation: [number, number, number]
  scrollStart: number // 0-1 when animation starts
  scrollEnd: number   // 0-1 when animation ends
  color: string
  metalness: number
  roughness: number
  scale?: number
  gearTeeth?: number
}

// Brand colors
export const COLORS = {
  navyPrimary: '#1e4b7a',
  navyDark: '#153658',
  navyLight: '#2d6aa3',
  accent: '#dc2626',
  steel: '#71797E',
  chrome: '#C0C0C0',
  darkSteel: '#4A5568',
}

export const assemblyParts: AssemblyPartConfig[] = [
  // Outer housing - first to separate
  {
    id: 'housing',
    name: 'Housing',
    description: 'The outer casing that protects internal components and provides structural support',
    geometry: 'housing',
    assembledPosition: [0, 0, 0],
    explodedPosition: [0, 0, -4],
    assembledRotation: [0, 0, 0],
    explodedRotation: [0, Math.PI * 0.15, 0],
    scrollStart: 0.05,
    scrollEnd: 0.2,
    color: COLORS.navyDark,
    metalness: 0.7,
    roughness: 0.4,
    scale: 1.2,
  },
  // Main drive gear - center piece
  {
    id: 'mainGear',
    name: 'Main Drive Gear',
    description: 'The primary gear that transfers power through the assembly with precision-cut teeth',
    geometry: 'gear',
    assembledPosition: [0, 0, 0],
    explodedPosition: [-2.5, 1.5, 0],
    assembledRotation: [0, 0, 0],
    explodedRotation: [0, 0, Math.PI * 0.25],
    scrollStart: 0.15,
    scrollEnd: 0.35,
    color: COLORS.navyPrimary,
    metalness: 0.85,
    roughness: 0.2,
    scale: 1,
    gearTeeth: 20,
  },
  // Secondary gear - meshes with main
  {
    id: 'secondaryGear',
    name: 'Secondary Gear',
    description: 'Works in harmony with the main gear to achieve the desired gear ratio',
    geometry: 'gear',
    assembledPosition: [1.2, 0.8, 0],
    explodedPosition: [2.5, 2, 1],
    assembledRotation: [0, 0, Math.PI / 20], // Offset to mesh teeth
    explodedRotation: [0, Math.PI * 0.2, Math.PI * 0.15],
    scrollStart: 0.25,
    scrollEnd: 0.45,
    color: COLORS.navyLight,
    metalness: 0.85,
    roughness: 0.2,
    scale: 0.7,
    gearTeeth: 14,
  },
  // Central shaft
  {
    id: 'shaft',
    name: 'Drive Shaft',
    description: 'The central axis that transmits rotational force through the entire assembly',
    geometry: 'shaft',
    assembledPosition: [0, 0, 0],
    explodedPosition: [0, -1.5, 2],
    assembledRotation: [Math.PI / 2, 0, 0],
    explodedRotation: [Math.PI / 2 + 0.3, 0.2, 0],
    scrollStart: 0.35,
    scrollEnd: 0.55,
    color: COLORS.chrome,
    metalness: 0.95,
    roughness: 0.1,
    scale: 1,
  },
  // Front bearing
  {
    id: 'bearingFront',
    name: 'Front Bearing',
    description: 'Precision bearing that ensures smooth rotation with minimal friction',
    geometry: 'bearing',
    assembledPosition: [0, 0, 0.8],
    explodedPosition: [-1.5, -1, 3],
    assembledRotation: [Math.PI / 2, 0, 0],
    explodedRotation: [Math.PI / 2 + 0.2, 0.3, 0],
    scrollStart: 0.5,
    scrollEnd: 0.7,
    color: COLORS.steel,
    metalness: 0.9,
    roughness: 0.15,
    scale: 0.8,
  },
  // Rear bearing
  {
    id: 'bearingRear',
    name: 'Rear Bearing',
    description: 'Paired with the front bearing for balanced load distribution',
    geometry: 'bearing',
    assembledPosition: [0, 0, -0.8],
    explodedPosition: [1.5, -1.5, -2],
    assembledRotation: [Math.PI / 2, 0, 0],
    explodedRotation: [Math.PI / 2 - 0.2, -0.3, 0],
    scrollStart: 0.55,
    scrollEnd: 0.75,
    color: COLORS.steel,
    metalness: 0.9,
    roughness: 0.15,
    scale: 0.8,
  },
  // End plate
  {
    id: 'endPlate',
    name: 'End Plate',
    description: 'Seals the assembly and provides mounting points for integration',
    geometry: 'plate',
    assembledPosition: [0, 0, 1.5],
    explodedPosition: [0, 2, 4],
    assembledRotation: [0, 0, 0],
    explodedRotation: [0.2, Math.PI * 0.1, 0],
    scrollStart: 0.7,
    scrollEnd: 0.9,
    color: COLORS.navyPrimary,
    metalness: 0.75,
    roughness: 0.35,
    scale: 1,
  },
]

// Content sections that appear during scroll
export interface ContentSectionConfig {
  id: string
  scrollPosition: number // 0-5 (pages)
  title: string
  subtitle?: string
  description: string
  alignment: 'left' | 'right' | 'center'
}

export const contentSections: ContentSectionConfig[] = [
  {
    id: 'intro',
    scrollPosition: 0.3,
    title: 'CSME Concordia',
    subtitle: 'Student-led. Hands-on. Connected.',
    description: 'We are the Mechanical Engineering student club at Concordia, bringing curious minds together through projects, workshops, and industry events.',
    alignment: 'left',
  },
  {
    id: 'precision',
    scrollPosition: 1.2,
    title: 'Projects That Teach',
    subtitle: 'Build, test, iterate',
    description: 'From design challenges to long-term builds, our teams learn by doing and support each other through every milestone.',
    alignment: 'right',
  },
  {
    id: 'collaboration',
    scrollPosition: 2.2,
    title: 'Community First',
    subtitle: 'Mentorship and teamwork',
    description: 'New members pair with experienced leads, so everyone can grow their skills and contribute with confidence.',
    alignment: 'left',
  },
  {
    id: 'durability',
    scrollPosition: 3.2,
    title: 'Industry Connections',
    subtitle: 'Speakers, tours, networking',
    description: 'We invite engineers and alumni to share real-world insights and open doors to internships and careers.',
    alignment: 'right',
  },
  {
    id: 'cta',
    scrollPosition: 4.2,
    title: 'Join CSME',
    subtitle: 'All majors welcome',
    description: 'Whether you want to build, lead, or learn, there is a place for you in our club.',
    alignment: 'center',
  },
]
