import type { GlobalConfig } from 'payload'

export const LabStatus: GlobalConfig = {
  slug: 'lab-status',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'isOpen',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      defaultValue: 'Lab status will be updated when a team member checks in.',
    },
    {
      name: 'updatedBy',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
