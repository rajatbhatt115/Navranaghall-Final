import { CollectionConfig } from 'payload/types';

const HomeBanners: CollectionConfig = {
  slug: 'homeBanners',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageName',
      type: 'select',
      required: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Shop', value: 'shop' },
        { label: 'Blog', value: 'blog' },
        { label: 'Contact', value: 'contact' },
        { label: 'Cart', value: 'cart' },
        { label: 'Wishlist', value: 'wishlist' },
        { label: 'Product', value: 'product' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
    },
    {
      name: 'buttonLink',
      type: 'text',
    },
    {
      name: 'imageUrl',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
};

export default HomeBanners;