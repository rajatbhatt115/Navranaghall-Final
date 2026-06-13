/**
 * PAYLOAD CONFIG EXAMPLE FILE
 * Copy this file to payload.config.ts and add your actual values
 * NEVER commit payload.config.ts to git!
 */

import { buildConfig } from 'payload/config.js';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';

// Collections
import Users from './collections/Users.js';
import Media from './collections/Media.js';
import HomeBanners from './collections/HomeBanners.js';
import DiscoverProducts from './collections/DiscoverProducts.js';
import AboutContent from './collections/AboutContent.js';
import Categories from './collections/Categories.js';
import TopRatingProducts from './collections/TopRatingProducts.js';
import Testimonials from './collections/Testimonials.js';
import Blogs from './collections/Blogs.js';
import Products from './collections/Products.js';
import Team from './collections/Team.js';
import CartItems from './collections/CartItems.js';
import WishlistItems from './collections/WishlistItems.js';
import Orders from './collections/Orders.js';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Navrang Hall Admin',
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  collections: [
    Users,
    Media,
    HomeBanners,
    DiscoverProducts,
    AboutContent,
    Categories,
    TopRatingProducts,
    Testimonials,
    Blogs,
    Products,
    Team,
    CartItems,
    WishlistItems,
    Orders,
  ],
  cors: ['http://localhost:3000', 'http://localhost:5000'],
  csrf: ['http://localhost:3000'],
});