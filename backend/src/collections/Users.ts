import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 0,
    cookies: {
      secure: false,
      sameSite: 'lax',
    },
    tokenExpiration: 604800,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
    admin: ({ req }) => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      defaultValue: 'user',
    },
  ],
};

export default Users;