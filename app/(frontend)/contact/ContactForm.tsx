'use client'

import { useState } from 'react'
import { sendContactEmail } from './actions'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    setMessage('')

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setStatus('success')
        setMessage('Thank you for your message! We\'ll get back to you soon.')
        // Reset form
        const form = document.getElementById('contact-form') as HTMLFormElement
        form?.reset()
      } else {
        setStatus('error')
        setMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form id="contact-form" action={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="form-input"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="form-input"
          placeholder="your.email@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-slate-700 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Subject *
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="form-input"
        >
          <option value="">Select a subject</option>
          <option value="membership">Membership Inquiry</option>
          <option value="projects">Project Information</option>
          <option value="events">Events & Workshops</option>
          <option value="sponsorship">Sponsorship Opportunities</option>
          <option value="collaboration">Collaboration Proposal</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="form-input form-textarea"
          placeholder="Tell us how we can help you..."
        />
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 ${
            status === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
