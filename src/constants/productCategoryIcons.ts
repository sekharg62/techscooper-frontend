import type { IconType } from 'react-icons'
import {
  HiOutlineArrowPath,
  HiOutlineBeaker,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineBuildingStorefront,
  HiOutlineCake,
  HiOutlineCommandLine,
  HiOutlineComputerDesktop,
  HiOutlineCpuChip,
  HiOutlineCube,
  HiOutlineCubeTransparent,
  HiOutlineDevicePhoneMobile,
  HiOutlineEyeDropper,
  HiOutlineFaceSmile,
  HiOutlineFire,
  HiOutlineGift,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineLifebuoy,
  HiOutlinePaintBrush,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlinePlayCircle,
  HiOutlinePresentationChartBar,
  HiOutlineShoppingCart,
  HiOutlineSparkles,
  HiOutlineSquaresPlus,
  HiOutlineStar,
  HiOutlineSwatch,
  HiOutlineTag,
  HiOutlineTrophy,
  HiOutlineTv,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2'

import type { ProductCategory } from './productCategories'

/** Outline icon component for each catalog category (`react-icons/hi2`, matches product cards). */
export const PRODUCT_CATEGORY_ICONS = {
  ELECTRONICS: HiOutlineCpuChip,
  MOBILE: HiOutlineDevicePhoneMobile,
  LAPTOP: HiOutlineComputerDesktop,
  ACCESSORIES: HiOutlineSquaresPlus,

  CLOTHING: HiOutlineSwatch,
  FOOTWEAR: HiOutlineArrowPath,
  FASHION_ACCESSORIES: HiOutlineSparkles,

  HOME: HiOutlineHome,
  FURNITURE: HiOutlineBuildingStorefront,
  HOME_DECOR: HiOutlinePaintBrush,
  KITCHEN: HiOutlineFire,
  APPLIANCES: HiOutlineTv,

  BEAUTY: HiOutlineEyeDropper,
  PERSONAL_CARE: HiOutlinePresentationChartBar,

  BOOKS: HiOutlineBookOpen,
  STATIONERY: HiOutlinePencilSquare,

  SPORTS: HiOutlineTrophy,
  FITNESS: HiOutlineBolt,

  TOYS: HiOutlineGift,
  BABY_PRODUCTS: HiOutlineFaceSmile,

  AUTOMOTIVE: HiOutlineWrenchScrewdriver,

  GROCERY: HiOutlineShoppingCart,
  FOOD: HiOutlineCake,
  BEVERAGES: HiOutlineBeaker,

  HEALTH: HiOutlineHeart,
  MEDICAL: HiOutlineLifebuoy,

  PET_SUPPLIES: HiOutlineCubeTransparent,

  OFFICE_SUPPLIES: HiOutlineBriefcase,

  JEWELRY: HiOutlineStar,

  GAMES: HiOutlinePlayCircle,
  SOFTWARE: HiOutlineCommandLine,

  TRAVEL: HiOutlinePaperAirplane,

  OTHER: HiOutlineTag,
} as const satisfies Record<ProductCategory, IconType>

export function getProductCategoryIcon(category: ProductCategory): IconType {
  return PRODUCT_CATEGORY_ICONS[category]
}

/** Fallback for runtime strings from the API that may drift from the frontend enum. */
export function resolveProductCategoryIcon(category: string): IconType {
  if (category in PRODUCT_CATEGORY_ICONS) {
    return PRODUCT_CATEGORY_ICONS[category as ProductCategory]
  }
  return HiOutlineCube
}
