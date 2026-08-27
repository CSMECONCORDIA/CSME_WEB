import type { CollectionConfig } from 'payload'

export const Checkouts: CollectionConfig = {
  slug: 'checkouts',
  admin: {
    defaultColumns: ['customer', 'item', 'status', 'checkedOutAt', 'dueDate'],
    description: 'Records of items checked out by students',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      hasMany: false,
    },
    {
      name: 'item',
      type: 'relationship',
      relationTo: 'inventory-items',
      required: true,
      hasMany: false,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'checked-out',
      options: [
        { label: 'Checked Out', value: 'checked-out' },
        { label: 'Returned', value: 'returned' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Lost', value: 'lost' },
        { label: 'Damaged', value: 'damaged' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'checkedOutAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'returnedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => data?.status === 'returned',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes about this checkout (condition, special instructions, etc.)',
      },
    },
  ],
}
