/**
 * PAYLOAD CONFIG EXAMPLE FILE
 * Copy this file to payload.config.ts and add your actual values
 * NEVER commit payload.config.ts to git!
 */

import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';

// Collections
import Users from './collections/Users';
import Media from './collections/Media';           // ✅ ADD THIS
import HomeBanners from './collections/HomeBanners';
import DiscoverProducts from './collections/DiscoverProducts';
import AboutContent from './collections/AboutContent';
import Categories from './collections/Categories';
import TopRatingProducts from './collections/TopRatingProducts';
import Testimonials from './collections/Testimonials';
import Blogs from './collections/Blogs';
import Products from './collections/Products';
import Team from './collections/Team';
import CartItems from './collections/CartItems';
import WishlistItems from './collections/WishlistItems';
import Orders from './collections/Orders';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',  // ALWAYS use env variable, never hardcode!
  }),
  collections: [
    Users,
    Media,                                 // ✅ ADD THIS
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
  cors: ['http://localhost:3000'],
  csrf: ['http://localhost:3000'],
});