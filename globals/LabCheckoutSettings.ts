import type { GlobalConfig } from 'payload'
import { hashLabPassword } from '../lib/labCheckout/password.ts'

// Settings for the /checkout lab pages. Only logged-in admins can read or edit
// these — the password hash must never be readable from the public API.
export const LabCheckoutSettings: GlobalConfig = {
  slug: 'lab-checkout-settings',
  label: 'Lab Checkout Settings',
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const newPassword = typeof data.newPassword === 'string' ? data.newPassword.trim() : ''
        if (newPassword) {
          data.passwordHash = hashLabPassword(newPassword)
        } else {
          // Keep the existing hash when the password box is left empty.
          data.passwordHash = originalDoc?.passwordHash ?? data.passwordHash ?? null
        }
        data.passwordIsSet = Boolean(data.passwordHash)
        data.newPassword = ''
        return data
      },
    ],
  },
  fields: [
    {
      name: 'passwordIsSet',
      label: 'Lab password is set',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'If unchecked, the /checkout page stays locked until you set a password below.',
      },
    },
    {
      name: 'newPassword',
      label: 'Set new lab password',
      type: 'text',
      virtual: true,
      admin: {
        readOnly: false, // Payload makes virtual fields read-only unless told otherwise
        description:
          'Type a new password and save to change it. Leave empty to keep the current one. It is stored hashed and this box clears after saving.',
      },
    },
    {
      name: 'passwordHash',
      type: 'text',
      admin: { hidden: true },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'idleTimeoutMinutes',
          label: 'Idle time before warning (minutes)',
          type: 'number',
          required: true,
          defaultValue: 3,
          min: 1,
        },
        {
          name: 'warningSeconds',
          label: 'Countdown before locking (seconds)',
          type: 'number',
          required: true,
          defaultValue: 30,
          min: 5,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultCheckoutDays',
          label: 'Default loan length (days)',
          type: 'number',
          required: true,
          defaultValue: 3,
          min: 1,
          admin: {
            description: "Used when an item has no 'Max Checkout Days' of its own.",
          },
        },
        {
          name: 'maxCheckoutDays',
          label: 'Maximum loan length (days)',
          type: 'number',
          required: true,
          defaultValue: 3,
          min: 1,
          admin: {
            description: 'No loan is ever longer than this, whatever the item says.',
          },
        },
      ],
    },
  ],
}
