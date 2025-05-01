export const IMAGE_PATHS = {
  // Main logos
  LOGO_MAIN: '/assets/logo-main.jpg',
  LOGO: '/assets/logo.png',
  LOGOTYPE: '/assets/logotype.png',
  LOGO_ALT: '/assets/_logo.png',
  LOGO_ALT_2: '/assets/__logo.jpg',

  // Background images
  SEARCH_BG: '/assets/search-bg.png',
  SEARCH_BG_SVG: '/assets/search-bg.svg',
  SEARCH_BG_JPG: '/assets/search-bg.jpg',

  // Promotional images
  PROMO: '/assets/promo.png',
  PROMO_DISCOUNT: '/assets/promo-discount.png',
  PROMO_2: '/assets/promo-2.png',

  // Service category images
  LAUNDRY: '/assets/laundry.png',
  GARAGE: '/assets/garage.png',
  CLEANING: '/assets/cleaning.png',

  // Utility images
  NO_RESULTS: '/assets/no-results-found.svg',
  VERIFY_EMAIL: '/assets/verify-email.svg',
  IMAGE_PLACEHOLDER: '/assets/image.png',

  // Landing page images
  LANDING_PAGE: {
    MAIN_BG: '/assets/landing-page/main_page_bg.jpeg',
    OFFICE_CLEANING: '/assets/landing-page/office-cleaning-service.jpeg',
    MECHANIC: '/assets/landing-page/Mechanic.jpeg',
    CARPENTRY: '/assets/landing-page/carpentry.jpeg',
    INTERIOR: '/assets/landing-page/Interior.jpeg',
    PLUMBING: '/assets/landing-page/Plumbing.jpeg',
    ELECTRICAL: '/assets/landing-page/Electrical.jpeg',
    MASONRY: '/assets/landing-page/masonry_service.jpeg',
    SUCCESS: '/assets/landing-page/success.png',
    DASHBOARD: '/assets/landing-page/dashboard.png',
    BENEFITS: '/assets/landing-page/benefits.png',
  },
} as const;

// Type for the image paths
export type ImagePath = typeof IMAGE_PATHS[keyof typeof IMAGE_PATHS]; 