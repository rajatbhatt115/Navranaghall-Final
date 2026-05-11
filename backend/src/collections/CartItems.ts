import { CollectionConfig } from 'payload/types';

const CartItems: CollectionConfig = {
  slug: 'cartItems',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
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
  ],
};

export default CartItems;