import { CollectionConfig } from 'payload/types';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'category', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
    admin: ({ req }) => true,
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
      type: 'upload',
      relationTo: 'media',
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
      label: 'Product Images Gallery',
      fields: [
        { 
          name: 'thumb', 
          type: 'upload',  // ✅ CHANGE: text se upload
          relationTo: 'media',
          label: 'Thumbnail Image'
        },
        { 
          name: 'large', 
          type: 'upload',  // ✅ CHANGE: text se upload
          relationTo: 'media',
          label: 'Large Image'
        },
      ],
    },
    {
      name: 'reviews',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
};

export default Products;