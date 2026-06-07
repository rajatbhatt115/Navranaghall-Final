import { CollectionConfig } from 'payload/types';

const TopRatingProducts: CollectionConfig = {
  slug: 'top-rating-products',
  admin: {
    useAsTitle: 'category',
    defaultColumns: ['category', 'products'],
  },
  access: {
    read: () => true,
    create: ({ req }) => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
    admin: ({ req }) => true,  // ✅ ADD THIS - Admin panel access
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Kids', value: 'kids' },
        { label: 'Women', value: 'women' },
        { label: 'Jewellery', value: 'jewellery' },
      ],
    },
    {
      name: 'products',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'price', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
};

export default TopRatingProducts;