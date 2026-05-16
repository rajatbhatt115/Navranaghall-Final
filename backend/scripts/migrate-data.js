const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const dbJson = require('../data/db.json');

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;

    // Clear existing data (except media)
    await db.collection('homebanners').deleteMany({});
    await db.collection('discoverproducts').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('testimonials').deleteMany({});
    await db.collection('teams').deleteMany({});
    await db.collection('aboutcontents').deleteMany({});
    await db.collection('topratingproducts').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('blogs').deleteMany({});
    await db.collection('cartitems').deleteMany({});
    await db.collection('wishlistitems').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Migrate HomeBanners (keep imageUrl as text, not upload)
    if (dbJson.homeBanners?.length) {
      for (const banner of dbJson.homeBanners) {
        await db.collection('homebanners').insertOne({
          pageName: banner.id === 1 ? 'home' : banner.id === 2 ? 'about' : banner.id === 3 ? 'shop' : banner.id === 4 ? 'blog' : banner.id === 5 ? 'contact' : banner.id === 6 ? 'account' : banner.id === 7 ? 'cart' : banner.id === 8 ? 'wishlist' : 'product',
          title: banner.title,
          subtitle: banner.subtitle || '',
          description: banner.description,
          buttonText: banner.buttonText || '',
          buttonLink: banner.buttonLink || '',
          imageUrl: banner.imageUrl,  // Keep as text
        });
      }
      console.log('HomeBanners migrated');
    }

    // Migrate DiscoverProducts (keep image as text)
    if (dbJson.discoverProducts?.length) {
      for (const product of dbJson.discoverProducts) {
        await db.collection('discoverproducts').insertOne({
          title: product.title,
          badge: product.badge,
          bgColor: product.bgColor,
          image: product.image,  // Keep as text
        });
      }
      console.log('DiscoverProducts migrated');
    }

    // Migrate Categories (keep image as text)
    if (dbJson.categories?.length) {
      for (const cat of dbJson.categories) {
        await db.collection('categories').insertOne({
          title: cat.title,
          description: cat.description,
          image: cat.image,  // Keep as text
        });
      }
      console.log('Categories migrated');
    }

    // Migrate Products (keep image as text)
    if (dbJson.products?.length) {
      for (const product of dbJson.products) {
        await db.collection('products').insertOne({
          title: product.title,
          price: product.price,
          category: product.category,
          sizes: product.sizes,
          rating: product.rating,
          image: product.image,  // Keep as text
          isNew: product.isNew,
          description: product.description || '',
          images: product.images || [],
          reviews: product.reviews || [],
        });
      }
      console.log('Products migrated');
    }

    // Migrate Testimonials (keep image as text)
    if (dbJson.testimonials?.length) {
      for (const test of dbJson.testimonials) {
        await db.collection('testimonials').insertOne({
          name: test.name,
          text: test.text,
          image: test.image,  // Keep as text
        });
      }
      console.log('Testimonials migrated');
    }

    // Migrate Team (keep image as text)
    if (dbJson.team?.length) {
      for (const member of dbJson.team) {
        await db.collection('teams').insertOne({
          name: member.name,
          role: member.role,
          image: member.image,  // Keep as text
        });
      }
      console.log('Team migrated');
    }

    // Migrate AboutContent
    if (dbJson.aboutContent?.length) {
      const about = dbJson.aboutContent[0];
      await db.collection('aboutcontents').insertOne({
        experienceTitle: about.experienceTitle,
        experienceTexts: about.experienceTexts,
        founder: about.founder,
        mission: about.mission,
        awards: about.awards,
        historyTitle: about.historyTitle,
        historySubtitle: about.historySubtitle,
        timeline: about.timeline,
      });
      console.log('AboutContent migrated');
    }

    // Migrate TopRatingProducts
    if (dbJson.topRatingProducts) {
      for (const [category, products] of Object.entries(dbJson.topRatingProducts)) {
        await db.collection('topratingproducts').insertOne({
          category: category,
          products: products,
        });
      }
      console.log('TopRatingProducts migrated');
    }

    // Migrate Users (with hashed passwords)
    if (dbJson.users?.length) {
      for (const user of dbJson.users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.collection('users').insertOne({
          email: user.email,
          password: hashedPassword,
          name: user.name,
          createdAt: new Date(user.createdAt),
        });
      }
      console.log('Users migrated');
    }

    console.log('✅ Migration completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrate();