import Link from 'next/link'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
import { formatPostDate } from '@/lib/blog'
import type { Blog } from '@/payload-types'

export function BlogCard({ post }: { post: Blog }) {
  const preview = post.description ? convertLexicalToPlaintext({ data: post.description }).trim() : ''

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <article className="group card-hover h-full flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden p-6">
        {post.postDate && (
          <time dateTime={post.postDate} className="block text-sm text-slate-500 dark:text-slate-400 mb-2">
            {formatPostDate(post.postDate)}
          </time>
        )}

        <h3
          className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-navy dark:group-hover:text-navy-light transition-colors break-words"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {post.title}
        </h3>

        {preview && <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{preview}</p>}

        {/* Arrow Link */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm text-navy dark:text-navy-light font-medium uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
            Read Post
          </span>
          <svg
            className="w-5 h-5 text-navy dark:text-navy-light transform group-hover:translate-x-2 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </article>
    </Link>
  )
}
