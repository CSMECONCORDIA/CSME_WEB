import { LabStatusContent } from './LabStatusContent'

export const metadata = {
  title: 'Lab Status | CSME Concordia',
  description: 'Check the current status of the CSME lab including 3D printer availability and lab open hours.',
}

export default function LabStatusPage() {
  return <LabStatusContent />
}