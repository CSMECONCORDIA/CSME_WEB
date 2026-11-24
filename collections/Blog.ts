import type { CollectionBeforeValidateHook, CollectionConfig, PayloadRequest } from 'payload'
import { slugify } from '../lib/blog.ts'

/** Adds -2, -3, ... until no other post uses the slug. */
async function uniqueSlug(base: string, req: PayloadRequest, ownId?: number | string): Promise<string> {
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`
    const { docs } = await req.payload.find({
      collection: 'blog',
      where: {
        slug: { equals: slug },
        ...(ownId !== undefined ? { id: { not_equals: ownId } } : {}),
      },
      limit: 1,
      depth: 0,
      pagination: false,
      overrideAccess: true,
      req,
    })
    if (docs.length === 0) return slug
  }
}

/** Fills in the slug and the post date so the author only needs a title and text. */
const fillSlugAndDate: CollectionBeforeValidateHook = async ({ data, originalDoc, operation, req }) => {
  if (!data) return data

  // On update, fields that weren't sent stay as they are.
  if (operation === 'create' || 'slug' in data) {
    // The slug is kept when the title changes later, so shared links keep working.
    const wanted = slugify(data.slug || '') || originalDoc?.slug || slugify(data.title || '') || 'post'
    data.slug = wanted === originalDoc?.slug ? wanted : await uniqueSlug(wanted, req, originalDoc?.id)
  }
  if (operation === 'create' || 'postDate' in data) {
    data.postDate = data.postDate || originalDoc?.postDate || new Date().toISOString()
  }
  return data
}

export const Blog: CollectionConfig = {
  slug: 'blog',
  labels: { singular: 'Blog Post', plural: 'Blog Posts' },
  defaultSort: '-postDate',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'postDate', 'archived'],
    description: 'Posts shown on the /blog page. Enter a title and text; the date and web address are filled in for you.',
  },
  access: {
    // Archived posts are only visible to logged-in users.
    read: ({ req }) => (req.user ? true : { archived: { not_equals: true } }),
  },
  hooks: {
    beforeValidate: [fillSlugAndDate],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Text',
      type: 'richText',
      required: true,
    },
    {
      // Not "required" so the admin form can be saved with it empty; the hook always fills it.
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Web address: /blog/<slug>. Leave empty to create it from the title.',
      },
    },
    {
      name: 'postDate',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        description: "Leave empty to use today's date.",
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hides the post from the website.',
      },
    },
  ],
}
