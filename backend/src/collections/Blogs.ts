import { CollectionConfig } from 'payload/types';

const Blogs: CollectionConfig = {
  slug: 'blogs',
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
    },
    {
      name: 'authorImage',
      type: 'text',
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'isMainBlog',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'pageNumber',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'blogType',
      type: 'select',
      options: [
        { label: 'Main', value: 'main' },
        { label: 'Small', value: 'small' },
      ],
      defaultValue: 'small',
    },
    {
      name: 'comments',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'avatar', type: 'text' },
        { name: 'date', type: 'date' },
      ],
    },
  ],
};

export default Blogs;