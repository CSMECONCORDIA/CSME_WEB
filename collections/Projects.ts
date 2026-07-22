import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Projects: CollectionConfig = {
  slug: 'projects',
  hooks: {
    afterDelete: [
      async () => {
        revalidatePath('/projects')
        revalidatePath('/', 'layout')
      },
    ],
    afterChange: [
      async () => {
        revalidatePath('/projects')
        revalidatePath('/', 'layout')
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featured', 'startDate'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'ongoing',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'teamMembers',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
