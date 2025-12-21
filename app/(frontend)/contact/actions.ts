'use server'

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
    // Here you would integrate with your email service
    // Options include:
    // 1. Resend (https://resend.com) - Modern email API
    // 2. Nodemailer with SMTP
    // 3. SendGrid
    // 4. AWS SES

    // Example with Resend (you'll need to install and configure it):
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    //
    // await resend.emails.send({
    //   from: 'CSME Website <noreply@csme-concordia.ca>',
    //   to: ['csme@concordia.ca'],
    //   replyTo: email,
    //   subject: `[CSME Contact] ${subject} - from ${name}`,
    //   text: `
    //     Name: ${name}
    //     Email: ${email}
    //     Subject: ${subject}
    //
    //     Message:
    //     ${message}
    //   `,
    // })

    // For now, we'll log the submission and return success
    // Replace this with actual email sending in production
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error('Error sending contact email:', error)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}
