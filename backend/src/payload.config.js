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
    url: process.env.MONGODB_URI || 'mongodb+srv://rajatnbhatt1994_db_user:Ty3NNllFdljqHxbi@navranghallfinal.vtsnozu.mongodb.net/navranghall?retryWrites=true&w=majority',
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
  cors: ['http://localhost:3000'],
  csrf: ['http://localhost:3000'],
});