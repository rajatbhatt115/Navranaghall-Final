import { CollectionConfig } from 'payload/types';

const TopRatingProducts: CollectionConfig = {
  slug: 'topRatingProducts',
  admin: {
    useAsTitle: 'category',
  },
  access: {
    read: () => true,  // Allow public read access
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
        { name: 'image', type: 'text', required: true },
      ],
    },
  ],
};

export default TopRatingProducts;