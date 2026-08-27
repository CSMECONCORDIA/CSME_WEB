import type { CollectionConfig } from 'payload'

export const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'barcode', 'category', 'quantityAvailable', 'quantityTotal'],
    description: 'Lab inventory items available for checkout',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'barcode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique barcode for scanning',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hand Tools', value: 'hand-tools' },
        { label: 'Power Tools', value: 'power-tools' },
        { label: 'Measuring', value: 'measuring' },
        { label: 'Safety', value: 'safety' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Microcontrollers', value: 'microcontrollers' },
        { label: '3D Printing', value: '3d-printing' },
        { label: 'Materials', value: 'materials' },
        { label: 'Consumables', value: 'consumables' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'quantityTotal',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
      admin: {
        description: 'Total quantity owned',
      },
    },
    {
      name: 'quantityAvailable',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
      admin: {
        description: 'Quantity currently available for checkout',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Storage location in the lab',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'maxCheckoutDays',
      type: 'number',
      defaultValue: 7,
      min: 1,
      admin: {
        description: 'Maximum number of days item can be checked out',
        position: 'sidebar',
      },
    },
  ],
}
