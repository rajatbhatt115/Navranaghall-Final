import { CollectionConfig } from 'payload/types';

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'user', 'totalAmount', 'paymentStatus', 'createdAt'],
  },
  access: {
    // ✅ Admin can read all, users can only read their own
    read: ({ req }) => {
      if (req.user && req.user.collection === 'users') {
        return { user: { equals: req.user.id } };
      }
      return true;
    },
    // ❌ Disable create for everyone (only checkout can create)
    create: () => false,
    // ❌ Disable update for everyone
    update: () => false,
    // ❌ Disable delete for everyone
    delete: () => false,
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
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
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        readOnly: true,
      },
      fields: [
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
      admin: {
        readOnly: true,
      },
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
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'razorpayOrderId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'razorpayPaymentId',
      type: 'text',
      admin: {
        readOnly: true,
      },
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

export default Orders;