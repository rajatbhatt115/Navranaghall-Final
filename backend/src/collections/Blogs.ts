import { CollectionConfig } from 'payload/types';

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author'],
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
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMM yyyy',
        },
      },
    },
    {
      name: 'authorImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Summary (Excerpt)',
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: '🏠 Show on Home Page',
      defaultValue: false,
    },
    {
      name: 'showOnBlog',
      type: 'checkbox',
      label: '📄 Show on Blog Listing Page',
      defaultValue: true,
    },
    {
      name: 'pageNumber',
      type: 'number',
      label: 'Blog Page Number',
      defaultValue: 1,
    },
    {
      name: 'blogType',
      type: 'select',
      label: 'Blog Type',
      options: [
        { label: 'Main (Large Card)', value: 'main' },
        { label: 'Small Card', value: 'small' },
      ],
      defaultValue: 'small',
    },
    {
      name: 'comments',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },      // ✅ ADDED - Email field
        { name: 'contact', type: 'text', required: true },    // ✅ ADDED - Contact number field
        { name: 'text', type: 'textarea', required: true },
        { name: 'date', type: 'date', defaultValue: () => new Date().toISOString() },
      ],
    },
  ],
};

export default Blogs;