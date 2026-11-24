import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
// Imported directly: the components index also pulls in the 3D scene, which this page doesn't need.
import { BlogCard } from '../components/BlogCard'
import {
  BlogHero,
  BlogSortBar,
  BlogGrid,
  BlogCardWrapper,
  BlogPagination,
  BlogEmptyState,
} from './BlogContent'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog | CSME Concordia',
  description: 'News and updates from CSME Concordia.',
}

const POSTS_PER_PAGE = 12

const sortOptions = [
  { value: 'newest', label: 'Newest', field: '-postDate' },
  { value: 'oldest', label: 'Oldest', field: 'postDate' },
  { value: 'title', label: 'Title A-Z', field: 'title' },
]

type Props = {
  searchParams: Promise<{ sort?: string | string[]; page?: string | string[] }>
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams
  const sort = sortOptions.find((o) => o.value === params.sort) ?? sortOptions[0]
  const page = Math.max(1, Math.floor(Number(params.page)) || 1)

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: posts, totalPages } = await payload.find({
    collection: 'blog',
    where: { archived: { not_equals: true } },
    sort: [sort.field, '-id'],
    limit: POSTS_PER_PAGE,
    page,
    depth: 0,
  })

  if (page > 1 && posts.length === 0) notFound()

  return (
    <div>
      <BlogHero />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {posts.length === 0 ? (
            <BlogEmptyState />
          ) : (
            <>
              <BlogSortBar options={sortOptions} current={sort.value} />
              {/* key: replay the entrance animation when the order or page changes */}
              <BlogGrid key={`${sort.value}-${page}`}>
                {posts.map((post) => (
                  <BlogCardWrapper key={post.id}>
                    <BlogCard post={post} />
                  </BlogCardWrapper>
                ))}
              </BlogGrid>
              <BlogPagination page={page} totalPages={totalPages} sort={sort.value} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
