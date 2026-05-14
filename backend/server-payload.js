import { buildConfig } from 'payload/config';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import { webpackBundler } from '@payloadcms/bundler-webpack';

import Users from './collections/Users';
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
  serverURL: 'http://localhost:5000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  collections: [
    Users,
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
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  csrf: ['http://localhost:3000'],
});