import { CollectionConfig } from 'payload/types';

const WishlistItems: CollectionConfig = {
  slug: 'wishlistItems',
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
      name: 'unitPrice',
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

export default WishlistItems;