import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Events: CollectionConfig = {
  slug: 'events',
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/events')
        revalidatePath('/', 'layout')
      },
    ],
    afterDelete: [
      async () => {
        revalidatePath('/events')
        revalidatePath('/', 'layout')
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'featured'],
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
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Optional: for multi-day events',
      },
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'registrationLink',
      type: 'text',
      admin: {
        description: 'External registration URL',
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
