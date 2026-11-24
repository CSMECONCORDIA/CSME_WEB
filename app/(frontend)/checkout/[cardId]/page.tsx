import { redirect } from 'next/navigation'
import {
  findStudentByCardId,
  getLabSettings,
  getPayloadClient,
  getStudentCheckouts,
  normalizeId,
} from '@/lib/labCheckout/inventory'
import { isLabUnlocked } from '@/lib/labCheckout/session'
import { IdleGuard } from '../IdleGuard'
import { CreateStudentForm } from './CreateStudentForm'
import { StudentStation } from './StudentStation'

export const metadata = {
  title: 'Lab Checkout | CSME Concordia',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function StudentCheckoutPage({ params }: { params: Promise<{ cardId: string }> }) {
  if (!(await isLabUnlocked())) redirect('/checkout?timedOut=1')

  const cardId = normalizeId(decodeURIComponent((await params).cardId))
  const payload = await getPayloadClient()
  const [settings, student] = await Promise.all([getLabSettings(payload), findStudentByCardId(payload, cardId)])

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {student ? (
          <StudentStation
            student={{ cardId: student.cardId, name: student.name, email: student.email ?? null, status: student.status }}
            {...await getStudentCheckouts(payload, student.id)}
          />
        ) : (
          <CreateStudentForm cardId={cardId} />
        )}
      </div>
      <IdleGuard idleMinutes={settings.idleTimeoutMinutes} warningSeconds={settings.warningSeconds} />
    </section>
  )
}
