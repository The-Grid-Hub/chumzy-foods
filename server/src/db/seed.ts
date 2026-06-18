import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { db } from './client.js'
import { products, reviews, adminUsers } from './schema.js'

const seedProducts = [
  {
    name: 'Fresh Palm Oil',
    slug: 'fresh-palm-oil',
    description:
      'Pure, natural red palm oil sourced directly from trusted farms. Rich in antioxidants and vitamins. Perfect for Nigerian soups and stews.',
    category: 'Oils',
    priceNgn: '8500',
    priceUsd: '8.50',
    priceGbp: '6.80',
    packagingSize: '5 litres, 10 litres, 25 litres',
    inStock: true,
    featured: true,
  },
  {
    name: 'Egusi (Melon Seeds)',
    slug: 'egusi-melon-seeds',
    description:
      'Premium quality ground egusi (melon seeds) for authentic Nigerian egusi soup. Carefully processed and packaged for maximum freshness.',
    category: 'Soup Ingredients',
    priceNgn: '6000',
    priceUsd: '6.00',
    priceGbp: '4.80',
    packagingSize: '500g, 1kg, 5kg',
    inStock: true,
    featured: true,
  },
  {
    name: 'Ogbono (Wild Mango Seeds)',
    slug: 'ogbono-wild-mango-seeds',
    description:
      'High-quality dried and ground ogbono seeds for delicious ogbono soup. Naturally thick and flavourful.',
    category: 'Soup Ingredients',
    priceNgn: '9000',
    priceUsd: '9.00',
    priceGbp: '7.20',
    packagingSize: '250g, 500g, 1kg',
    inStock: true,
    featured: true,
  },
  {
    name: 'White Garri',
    slug: 'white-garri',
    description:
      'Freshly processed white garri made from quality cassava. Great for eba, soaking, and as a snack. Fine and coarse options available.',
    category: 'Grains & Cassava',
    priceNgn: '4500',
    priceUsd: '4.50',
    priceGbp: '3.60',
    packagingSize: '1kg, 5kg, 10kg, 25kg',
    inStock: true,
    featured: false,
  },
  {
    name: 'Yellow Garri',
    slug: 'yellow-garri',
    description:
      'Golden yellow garri enriched with palm oil for a richer flavour. A favourite across Nigeria and in the diaspora.',
    category: 'Grains & Cassava',
    priceNgn: '5000',
    priceUsd: '5.00',
    priceGbp: '4.00',
    packagingSize: '1kg, 5kg, 10kg, 25kg',
    inStock: true,
    featured: false,
  },
  {
    name: 'Ijabu Garri',
    slug: 'ijabu-garri',
    description:
      'Premium coarse-grain garri variety from the Ijabu tradition. Extra crunchy, ideal for soaking with cold water and groundnuts.',
    category: 'Grains & Cassava',
    priceNgn: '5500',
    priceUsd: '5.50',
    priceGbp: '4.40',
    packagingSize: '1kg, 5kg, 10kg',
    inStock: true,
    featured: true,
  },
  {
    name: 'Stockfish',
    slug: 'stockfish',
    description:
      'Imported dried stockfish (dried cod) for authentic Nigerian soups. Rich in protein, naturally preserved without additives.',
    category: 'Dried Fish & Seafood',
    priceNgn: '25000',
    priceUsd: '25.00',
    priceGbp: '20.00',
    packagingSize: 'Per piece, 1kg pack, 5kg bulk',
    inStock: true,
    featured: true,
  },
  {
    name: 'Dryfish',
    slug: 'dryfish',
    description:
      'Assorted high-quality dried fish for soups and stews. Naturally smoked and sun-dried for maximum flavour and preservation.',
    category: 'Dried Fish & Seafood',
    priceNgn: '12000',
    priceUsd: '12.00',
    priceGbp: '9.60',
    packagingSize: '500g, 1kg, 5kg',
    inStock: true,
    featured: false,
  },
  {
    name: 'Crayfish',
    slug: 'crayfish',
    description:
      'Ground dried crayfish for adding deep umami flavour to all Nigerian soups and stews. Pure, no additives or preservatives.',
    category: 'Seafood Seasonings',
    priceNgn: '7500',
    priceUsd: '7.50',
    priceGbp: '6.00',
    packagingSize: '100g, 250g, 500g, 1kg',
    inStock: true,
    featured: false,
  },
  {
    name: 'Tin Tomatoes',
    slug: 'tin-tomatoes',
    description:
      'Premium quality canned tomatoes — concentrated and ready for your stews, jollof rice, and Nigerian sauces.',
    category: 'Canned Goods',
    priceNgn: '3500',
    priceUsd: '3.50',
    priceGbp: '2.80',
    packagingSize: '400g tin, 6-pack, 12-pack',
    inStock: true,
    featured: false,
  },
]

const seedReviews = [
  {
    customerName: 'Adaeze O.',
    country: 'United Kingdom',
    rating: 5,
    comment:
      'The palm oil is absolutely authentic. It tastes exactly like home. I have been ordering from Chumzy for 8 months and the quality is always consistent.',
    productsPurchased: 'Fresh Palm Oil, Egusi',
    approved: true,
  },
  {
    customerName: 'Chukwuemeka D.',
    country: 'United States',
    rating: 5,
    comment:
      'Finally found a reliable supplier for real Nigerian ingredients in the US. The stockfish arrived well-packaged and the quality is top-notch. Will definitely order again.',
    productsPurchased: 'Stockfish, Crayfish, Ogbono',
    approved: true,
  },
  {
    customerName: 'Ngozi B.',
    country: 'United Kingdom',
    rating: 5,
    comment:
      'Chumzy Raw Foods is my go-to for all my cooking needs. The garri is fresh and the egusi is perfectly ground. Delivery was prompt and packaging was excellent.',
    productsPurchased: 'White Garri, Egusi, Dryfish',
    approved: true,
  },
  {
    customerName: 'Ifeanyi M.',
    country: 'Nigeria',
    rating: 4,
    comment:
      'Very good quality products. I buy in bulk for my small restaurant and they always deliver on time. Prices are fair and the owner is very responsive on WhatsApp.',
    productsPurchased: 'Palm Oil, Crayfish, Stockfish',
    approved: true,
  },
  {
    customerName: 'Amaka S.',
    country: 'United States',
    rating: 5,
    comment:
      'I was skeptical about ordering raw food online but Chumzy exceeded my expectations. The ogbono soup I made tasted like my mother\'s cooking back in Anambra. 10/10!',
    productsPurchased: 'Ogbono, Crayfish, Palm Oil',
    approved: true,
  },
]

async function seed() {
  console.log('Seeding database...')

  await db.insert(products).values(seedProducts).onConflictDoNothing()
  console.log(`Inserted ${seedProducts.length} products`)

  await db.insert(reviews).values(seedReviews).onConflictDoNothing()
  console.log(`Inserted ${seedReviews.length} reviews`)

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    const inserted = await db
      .insert(adminUsers)
      .values({ email: adminEmail, passwordHash, role: 'admin' })
      .onConflictDoNothing()
      .returning({ id: adminUsers.id })
    console.log(`Inserted ${inserted.length} admin user(s)`)
  } else {
    console.log(
      'Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD to create the initial admin'
    )
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
