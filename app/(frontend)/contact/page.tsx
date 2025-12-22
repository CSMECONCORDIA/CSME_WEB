import { ContactForm } from './ContactForm'
import {
  ContactHero,
  ContactFormSection,
  ContactInfoSection,
  FAQSection,
} from './ContactContent'

export const metadata = {
  title: 'Contact Us | CSME Concordia',
  description: 'Get in touch with CSME Concordia - join our community, ask questions, or share your ideas.',
}

export default function ContactPage() {
  return (
    <div>
      <ContactHero />

      {/* Contact Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <ContactFormSection>
              <ContactForm />
            </ContactFormSection>

            {/* Contact Info */}
            <ContactInfoSection />
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  )
}
