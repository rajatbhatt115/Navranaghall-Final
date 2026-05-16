import { CollectionConfig } from 'payload/types';

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      label: 'Author Image',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Blog Image',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Short Summary (Excerpt)',
    },
    {
      name: 'isMainBlog',
      type: 'checkbox',
      label: 'Show on Home Page',
      defaultValue: false,
      admin: {
        description: 'Check this box to show this blog on the home page as main blog',
      },
    },
    {
      name: 'pageNumber',
      type: 'number',
      defaultValue: 1,
      admin: {
        condition: (data, siblingData) => !siblingData?.isMainBlog,
      },
    },
    {
      name: 'blogType',
      type: 'select',
      options: [
        { label: 'Main', value: 'main' },
        { label: 'Small', value: 'small' },
      ],
      defaultValue: 'small',
      admin: {
        condition: (data, siblingData) => !siblingData?.isMainBlog,
      },
    },
    {
      name: 'comments',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'avatar', type: 'text' },
        { 
          name: 'date', 
          type: 'date',
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
  ],
};

export default Blogs;