'use server'
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return { success: false, error: 'All fields are required.' }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const { error } = await resend.emails.send({
		from: 'CSME Website <onboarding@resend.dev>',
		to: ['it.csme@ecaconcordia.ca'],
		replyTo: email,
		subject: `[CSME Contact] ${subject} - from ${name}`,
		text: `
		Name: ${name}
		Email: ${email}
		Subject: ${subject}
		
		Message:
		${message}
		`,
    })
	  if (error) {
    console.error('Resend error:', error)
    return {
      success: false,
      error: 'Failed to send message. Please try again later.',
    }
  }

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
