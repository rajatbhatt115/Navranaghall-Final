import { CollectionConfig } from 'payload/types';

const CartItems: CollectionConfig = {
  slug: 'cart-items',  // Consistent naming
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'user', 'quantity', 'price', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return { user: { equals: req.user.id } };
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return { user: { equals: req.user.id } };
    },
    delete: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
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
        position: 'sidebar',
      },
    },
    {
      name: 'productId',
      type: 'text',
      required: true,
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