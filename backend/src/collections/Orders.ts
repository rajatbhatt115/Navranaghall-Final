import { CollectionConfig } from 'payload/types';

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'user', 'totalAmount', 'paymentStatus', 'createdAt'],
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
      return false;
    },
    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return false;
    },
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
    },
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
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'productId', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'size', type: 'text' },
        { name: 'image', type: 'text' },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default Orders;