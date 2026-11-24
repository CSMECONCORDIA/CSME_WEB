import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { LinkJSXConverter, RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import config from '@/payload.config'
import { formatPostDate } from '@/lib/blog'
import { GearDecoration } from '../../components/GearDecoration'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

// cache(): generateMetadata and the page share one database query per request.
const getPost = cache(async (slug: string) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'blog',
    where: {
      slug: { equals: slug },
      archived: { not_equals: true },
    },
    limit: 1,
    depth: 1,
    pagination: false,
  })

  return docs[0]
})

// Links an author makes to other pages of this site from inside a post.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc
      const target = doc?.value
      const slug = target && typeof target === 'object' && 'slug' in target ? target.slug : null
      const hasPage = doc && ['blog', 'events', 'projects'].includes(doc.relationTo)
      return hasPage && slug ? `/${doc.relationTo}/${slug}` : '/'
    },
  }),
})

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: 'Post Not Found | CSME Concordia' }
  }

  const text = post.description ? convertLexicalToPlaintext({ data: post.description }) : ''
  return {
    title: `${post.title} | CSME Concordia Blog`,
    description: text.replace(/\s+/g, ' ').trim().slice(0, 160) || undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 text-white/5">
          <GearDecoration size={500} spin />
        </div>
        <div className="absolute inset-0 grid-bg opacity-5" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white font-medium truncate max-w-[200px]">{post.title}</li>
            </ol>
          </nav>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 break-words" style={{ fontFamily: 'var(--font-display)' }}>
            {post.title}
          </h1>

          {post.postDate && (
            <time dateTime={post.postDate} className="text-white/60">
              {formatPostDate(post.postDate)}
            </time>
          )}
        </div>
      </section>

      {/* Post Text */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {post.description && (
            <RichText
              data={post.description}
              converters={converters}
              className="prose blog-post text-slate-600 dark:text-slate-300 text-lg break-words"
            />
          )}

          <div className="mt-16">
            <Link href="/blog" className="btn-primary">
              All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
