import { CollectionConfig } from 'payload/types';

const CartItems: CollectionConfig = {
  slug: 'cartItems',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'quantity', 'price', 'createdAt'],
  },
  access: {
    // ✅ Admin can read all, users can only read their own
    read: ({ req }) => {
      if (req.user && req.user.collection === 'users') {
        return { user: { equals: req.user.id } };
      }
      return true;
    },
    // ✅ Logged in users can create (frontend)
    create: ({ req }) => {
      return !!req.user;
    },
    // ✅ Users can update their own items
    update: ({ req }) => {
      if (!req.user) return false;
      return { user: { equals: req.user.id } };
    },
    // ✅ Users can delete their own items
    delete: ({ req }) => {
      if (!req.user) return false;
      return { user: { equals: req.user.id } };
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
    },
    {
      name: 'size',
      type: 'text',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
      },
    },
  ],
};

export default CartItems;