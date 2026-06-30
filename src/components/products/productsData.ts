export interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  helpfulVotes: number;
  images?: string[];
}

export interface QA {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  colors: string[];
  sizes: string[];
  imageUrl: string;
  gallery: string[];
  stockStatus: string;
  stockCount: number;
  deliveryTime: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  sellerName: string;
  returnPolicy: string;
  warranty: string;
  tags: string[];
  reviews: Review[];
  qas: QA[];
  modelType?: 'shoe' | 'drone' | 'headphones' | 'core';
}

// Deterministic mock image repository for each subcategory
const UNSPLASH_IMAGES: Record<string, string[]> = {
  Smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop'
  ],
  iPhones: [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=600&auto=format&fit=crop'
  ],
  'Android Phones': [
    'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop'
  ],
  Laptops: [
    'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop'
  ],
  MacBooks: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop'
  ],
  Tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b1002?q=80&w=600&auto=format&fit=crop'
  ],
  'Smart Watches': [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop'
  ],
  Earbuds: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=600&auto=format&fit=crop'
  ],
  Headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600&auto=format&fit=crop'
  ],
  Speakers: [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop'
  ],
  Cameras: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502920917128-1fc50ed65009?q=80&w=600&auto=format&fit=crop'
  ],
  Drones: [
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600&auto=format&fit=crop'
  ],
  Monitors: [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop'
  ],
  Shirts: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604644401890-0bd678c83788?q=80&w=600&auto=format&fit=crop'
  ],
  'T-Shirts': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
  ],
  Jeans: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop'
  ],
  Jackets: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop'
  ],
  Shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop'
  ],
  Sneakers: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop'
  ],
  Watches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop'
  ],
  Sarees: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'
  ],
  Dresses: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600&auto=format&fit=crop'
  ],
  Handbags: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566150905458-1bf1fc752228?q=80&w=600&auto=format&fit=crop'
  ],
  Jewellery: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
  ],
  Toys: [
    'https://images.unsplash.com/photo-1531325082793-ca7c9db6a5c3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=600&auto=format&fit=crop'
  ],
  Sofa: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=600&auto=format&fit=crop'
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop'
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'
  ],
  Sports: [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop'
  ],
  Books: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop'
  ],
  Automotive: [
    'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop'
  ]
};

// Fallback images pool
const GLOBAL_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop'
];

const CATEGORIES_DATA: Record<string, { subcategories: string[]; brands: string[] }> = {
  Electronics: {
    subcategories: ['Smartphones', 'iPhones', 'Android Phones', 'Laptops', 'MacBooks', 'Tablets', 'Smart Watches', 'Earbuds', 'Headphones', 'Speakers', 'Cameras', 'Drones', 'Monitors'],
    brands: ['Apple', 'Samsung', 'Sony', 'Bose', 'DJI', 'Canon', 'HP', 'Dell', 'Asus']
  },
  Fashion: {
    subcategories: ['Shirts', 'T-Shirts', 'Jeans', 'Jackets', 'Sarees', 'Dresses', 'Handbags', 'Jewellery', 'Watches'],
    brands: ['Nike', 'Adidas', 'Zara', 'Levi\'s', 'Ralph Lauren', 'Chanel', 'Gucci', 'Prada', 'Dior']
  },
  Gaming: {
    subcategories: ['Gaming Laptop', 'Gaming Mouse', 'Keyboard', 'Monitor', 'Gaming Chair', 'Console'],
    brands: ['Razer', 'Logitech G', 'SteelSeries', 'MSI', 'PlayStation', 'Xbox', 'CORSAIR']
  },
  Students: {
    subcategories: ['Laptops', 'Tablets', 'Books', 'School Bags', 'Stationery', 'Study Lamps'],
    brands: ['Moleskine', 'Casio', 'Eastpak', 'Apple', 'HP', 'Casio']
  },
  Home: {
    subcategories: ['Sofa', 'Chairs', 'Tables', 'Beds', 'Curtains', 'Kitchen', 'Storage', 'Decor', 'Plants'],
    brands: ['IKEA', 'West Elm', 'Pottery Barn', 'Dyson', 'Muji']
  },
  Beauty: {
    subcategories: ['Face Wash', 'Cream', 'Hair Oil', 'Shampoo', 'Makeup', 'Skin Care'],
    brands: ['L\'Oreal', 'Clinique', 'Estee Lauder', 'CeraVe', 'Mac Cosmetics']
  },
  Sports: {
    subcategories: ['Football', 'Cricket', 'Gym Equipment', 'Running Shoes', 'Yoga Mats'],
    brands: ['Wilson', 'Spalding', 'Under Armour', 'Nike Sports', 'Decathlon']
  },
  Books: {
    subcategories: ['Programming', 'Fiction', 'Education', 'Business'],
    brands: ['O\'Reilly Media', 'Penguin Books', 'McGraw-Hill', 'Packt Publishing']
  },
  Automotive: {
    subcategories: ['Helmet', 'Bike Accessories', 'Car Accessories'],
    brands: ['Shoei', 'Thule', 'Garmin', 'Bell Helmets', 'Pioneer']
  }
};

const SELLER_NAMES = ['Aura Retail', 'Nexus Authorized', 'Nova Store', 'Elite Merchants', 'Infinity Prime'];
const COLORS = ['Gold', 'Platinum Silver', 'Midnight Black', 'Emerald Green', 'Royal Violet', 'Crimson Red', 'Brushed Bronze'];
const SIZES = ['Standard', 'Compact', 'Pro Size', 'S', 'M', 'L', 'XL', 'XXL', '13-inch', '15-inch', '16-inch'];

// Generate 500+ deterministic realistic products
export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  const categoriesKeys = Object.keys(CATEGORIES_DATA);
  let idCounter = 1;

  categoriesKeys.forEach((category) => {
    const config = CATEGORIES_DATA[category];
    
    // Generate ~60 products per major category to safely exceed 500+ (9 total * 60 = 540 products)
    for (let i = 0; i < 60; i++) {
      const subcategory = config.subcategories[i % config.subcategories.length];
      const brand = config.brands[i % config.brands.length];
      const prodId = `NEX-${category.substring(0, 2).toUpperCase()}-${idCounter.toString().padStart(3, '0')}`;
      idCounter++;

      // Pick image deterministically
      let imgList = UNSPLASH_IMAGES[subcategory] || UNSPLASH_IMAGES[category] || GLOBAL_IMAGES;
      const primaryImg = imgList[i % imgList.length];
      const secondImg = imgList[(i + 1) % imgList.length] || GLOBAL_IMAGES[0];
      const thirdImg = imgList[(i + 2) % imgList.length] || GLOBAL_IMAGES[1];

      // Price mapping
      const baseOriginal = 150 + (i * 243) % 4500;
      const discountPercent = 10 + (i * 7) % 40; // 10% to 50%
      const discountVal = Math.round(baseOriginal * (discountPercent / 100));
      const discountPrice = baseOriginal - discountVal;

      // Ratings & reviews counts
      const rating = parseFloat((4.0 + ((i * 3) % 11) / 10).toFixed(1)); // 4.0 to 5.0
      const reviewsCount = 12 + (i * 49) % 2450;

      // Specifications list
      const specifications: Record<string, string> = {
        'Decryption Node': `${8.4 + (i % 5)} GHz Quantum`,
        'Atmosphere Fit': `${90 + (i % 9)}% Particulate Shield`,
        'Model Signature': `Ver. ${1.2 + (i % 8) * 0.1}`,
        'Core Build': i % 2 === 0 ? 'Brushed Aerogel Composite' : 'Titanium-Cobalt Mesh'
      };

      if (category === 'Electronics' || category === 'Gaming') {
        specifications['Power Input'] = '100W Fast-Sync USB-C';
        specifications['Interface'] = 'NeuralLink v2.5 wireless';
      } else if (category === 'Fashion') {
        specifications['Fabric Type'] = i % 2 === 0 ? '80% Organic Cotton, 20% Recycled Poly' : 'Smart Mesh NanoWeave';
        specifications['Fit Style'] = i % 2 === 0 ? 'Ergonomic Tailored' : 'Relaxed Streetwear';
      }

      // Generate features list
      const features = [
        `Integrated Quantum telemetry interface tracking real-time telemetry`,
        `Reinforced chassis engineered for luxury longevity`,
        `Low thermal emissivity index preserving core node battery`,
        `Authentic luxury styling detailing polished by master designers`
      ];

      // Generate verified reviews list
      const reviewsList: Review[] = Array.from({ length: 4 }).map((_, rIdx) => {
        const ratingOffset = (rIdx % 2 === 0 ? 1 : -1) * (rIdx % 2);
        const finalRating = Math.max(3, Math.min(5, Math.round(rating + ratingOffset)));
        return {
          name: ['Operator Vance', 'Seraphina Voss', 'Keanu K.', 'Dr. Helen Cho', 'Marcus Kane'][rIdx],
          avatar: '',
          rating: finalRating,
          date: `Jun ${10 + rIdx * 4}, 2026`,
          comment: [
            'Absolutely stunning. Design lines are clean, premium packaging, highly recommend this module.',
            'Quality is decent, though delivery took an extra cycle to route through sector 4.',
            'Best acquisition of the financial cycle! Instantly syncs with my workspace setup.',
            'An elegant addition to my tech collection. The gold trim matches perfectly.',
            'Incredible response speed and material feel. Meets luxury-white specifications.'
          ][rIdx],
          verified: rIdx % 3 !== 0,
          helpfulVotes: rIdx * 13 + 3,
          images: rIdx === 1 ? [secondImg] : undefined
        };
      });

      // Questions & Answers
      const qasList: QA[] = [
        {
          question: `Is this node fully compatible with modern smart docks?`,
          answer: `Yes, it connects seamlessly via universal standard interfaces and supports full telemetry reports.`
        },
        {
          question: `What is the return response window for this?`,
          answer: `We guarantee a 30-day hassle-free return window with complimentary freight collection.`
        }
      ];

      let modelType: 'shoe' | 'drone' | 'headphones' | 'core' | undefined = undefined;
      if (subcategory === 'Shoes' || subcategory === 'Sneakers' || subcategory === 'Running Shoes') {
        modelType = 'shoe';
      } else if (subcategory === 'Drones') {
        modelType = 'drone';
      } else if (subcategory === 'Headphones' || subcategory === 'Earbuds') {
        modelType = 'headphones';
      } else if (subcategory === 'Watches' || subcategory === 'Smart Watches') {
        modelType = 'core';
      }

      products.push({
        id: prodId,
        name: `${brand} ${subcategory} ${['Apex', 'Quantum', 'Vanguard', 'Infinite', 'Pro', 'Neo', 'Classic'][i % 7]}`,
        brand,
        brandLogo: '💎',
        category,
        subcategory,
        description: `Experience state-of-the-art craftsmanship with the ${brand} ${subcategory}. Engineered to provide elite specifications, this product features elegant styling accents, long-lasting premium components, and standard warranty protection. Perfect for users demanding superior standards.`,
        features,
        specifications,
        colors: COLORS.slice(0, 2 + (i % 4)),
        sizes: SIZES.slice(0, 2 + (i % 4)),
        imageUrl: primaryImg,
        gallery: [primaryImg, secondImg, thirdImg],
        stockStatus: i % 10 === 0 ? 'Only 2 Left' : 'In Stock',
        stockCount: i % 10 === 0 ? 2 : 25 + (i % 40),
        deliveryTime: i % 3 === 0 ? 'Next Day Express' : '2-3 Logistics Days',
        originalPrice: baseOriginal,
        discountPrice,
        discountPercent,
        rating,
        reviewsCount,
        sellerName: SELLER_NAMES[i % SELLER_NAMES.length],
        returnPolicy: '30-Day Hassle-Free Returns',
        warranty: '2-Year Direct Manufacturer Warranty',
        tags: [subcategory.toLowerCase(), brand.toLowerCase(), category.toLowerCase(), 'luxury', 'nexus'],
        reviews: reviewsList,
        qas: qasList,
        modelType
      });
    }
  });

  return products;
};

export const PRODUCTS = generateProducts();
