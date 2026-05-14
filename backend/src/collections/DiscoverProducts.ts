import { CollectionConfig } from 'payload/types';

const DiscoverProducts: CollectionConfig = {
  slug: 'discoverProducts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,  // Allow public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'badge',
      type: 'text',
      required: true,
    },
    {
      name: 'bgColor',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: true,
    },
  ],
};

export default DiscoverProducts;