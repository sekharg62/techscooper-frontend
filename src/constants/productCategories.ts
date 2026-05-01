/** Mirrors `enum ProductCategory` in `backend/prisma/schema.prisma`. */
export const PRODUCT_CATEGORIES = [
  'ELECTRONICS',
  'MOBILE',
  'LAPTOP',
  'ACCESSORIES',

  'CLOTHING',
  'FOOTWEAR',
  'FASHION_ACCESSORIES',

  'HOME',
  'FURNITURE',
  'HOME_DECOR',
  'KITCHEN',
  'APPLIANCES',

  'BEAUTY',
  'PERSONAL_CARE',

  'BOOKS',
  'STATIONERY',

  'SPORTS',
  'FITNESS',

  'TOYS',
  'BABY_PRODUCTS',

  'AUTOMOTIVE',

  'GROCERY',
  'FOOD',
  'BEVERAGES',

  'HEALTH',
  'MEDICAL',

  'PET_SUPPLIES',

  'OFFICE_SUPPLIES',

  'JEWELRY',

  'GAMES',
  'SOFTWARE',

  'TRAVEL',

  'OTHER',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
