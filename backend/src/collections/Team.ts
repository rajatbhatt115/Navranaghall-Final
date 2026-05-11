import { CollectionConfig } from 'payload/types';

const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
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

export default Team;