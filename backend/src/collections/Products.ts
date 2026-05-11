import { CollectionConfig } from 'payload/types';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Female', value: 'Female' },
        { label: 'Male', value: 'Male' },
        { label: 'Kids', value: 'Kids' },
        { label: 'Jewellery', value: 'Jewellery' },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      fields: [{ name: 'size', type: 'text' }],
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'isNew',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        { name: 'thumb', type: 'text' },
        { name: 'large', type: 'text' },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'avatar', type: 'text' },
      ],
    },
  ],
};

export default Products;