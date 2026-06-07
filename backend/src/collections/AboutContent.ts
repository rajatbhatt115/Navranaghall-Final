import { CollectionConfig } from 'payload/types';

const AboutContent: CollectionConfig = {
  slug: 'about-contents',
  admin: {
    useAsTitle: 'experienceTitle',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'experienceTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'experienceTexts',
      type: 'array',
      required: true,
      fields: [{ name: 'text', type: 'textarea', required: true }],
    },
    {
      name: 'founder',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'mission',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'awards',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'historyTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'historySubtitle',
      type: 'text',
      required: true,
    },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
};

export default AboutContent;