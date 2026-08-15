import type { Review } from './types'

export const REVIEWS: Review[] = [
  {
    id: 1,
    customerName: 'Adaeze O.',
    country: 'United Kingdom',
    rating: 5,
    comment:
      'The palm oil is absolutely authentic. It tastes exactly like home. I have been ordering from Chumzy for 8 months and the quality is always consistent.',
    productsPurchased: 'Fresh Palm Oil, Egusi',
  },
  {
    id: 2,
    customerName: 'Chukwuemeka D.',
    country: 'United States',
    rating: 5,
    comment:
      'Finally found a reliable supplier for real Nigerian ingredients in the US. The stockfish arrived well-packaged and the quality is top-notch.',
    productsPurchased: 'Stockfish, Crayfish, Ogbono',
  },
  {
    id: 3,
    customerName: 'Ngozi B.',
    country: 'United Kingdom',
    rating: 5,
    comment:
      'Chumzy Raw Foods is my go-to for all my cooking needs. The garri is fresh and the egusi is perfectly ground. Delivery was prompt and packaging was excellent.',
    productsPurchased: 'White Garri, Egusi, Dryfish',
  },
  {
    id: 4,
    customerName: 'Ifeanyi M.',
    country: 'Nigeria',
    rating: 4,
    comment:
      'Very good quality products. I buy in bulk for my small restaurant and they always deliver on time. Prices are fair and the owner is very responsive on WhatsApp.',
    productsPurchased: 'Palm Oil, Crayfish, Stockfish',
  },
  {
    id: 5,
    customerName: 'Amaka S.',
    country: 'United States',
    rating: 5,
    comment:
      "I was skeptical about ordering raw food online but Chumzy exceeded my expectations. The ogbono soup I made tasted like my mother's cooking back in Anambra. 10/10!",
    productsPurchased: 'Ogbono, Crayfish, Palm Oil',
  },
]

export const REVIEW_COUNT = REVIEWS.length

export const AVERAGE_RATING =
  REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length
