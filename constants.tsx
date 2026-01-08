
import { RoleCode, MemberStatus, PaymentMethod, Post, BlogPost, ProductItem, Wallet, Member } from './types.ts';

export const MOCK_USER: Member = {
  id: 'user-1',
  email: 'alex.creator@nexuscore.io',
  phone: '+15550123',
  status: MemberStatus.ACTIVE,
  mfaEnabled: true,
  role: RoleCode.CREATOR,
  points: 1250,
  createdAt: new Date().toISOString()
};

export const MOCK_MEMBERS: Member[] = [
  MOCK_USER,
  {
    id: 'user-2',
    email: 'sarah.j@nexuscore.io',
    phone: '+15550222',
    status: MemberStatus.ACTIVE,
    mfaEnabled: true,
    role: RoleCode.CREATOR,
    points: 840,
    createdAt: new Date(Date.now() - 2592000000).toISOString()
  },
  {
    id: 'user-3',
    email: 'm.chen@nexuscore.io',
    phone: '+15550333',
    status: MemberStatus.SUSPENDED,
    mfaEnabled: false,
    role: RoleCode.STAFF,
    points: 420,
    createdAt: new Date(Date.now() - 5184000000).toISOString()
  },
  {
    id: 'user-4',
    email: 'elena.r@nexuscore.io',
    phone: '+15550444',
    status: MemberStatus.ACTIVE,
    mfaEnabled: true,
    role: RoleCode.CUSTOMER,
    points: 150,
    createdAt: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: 'user-5',
    email: 'banned.bot@nexuscore.io',
    phone: '+15550999',
    status: MemberStatus.BANNED,
    mfaEnabled: false,
    role: RoleCode.CUSTOMER,
    points: 0,
    createdAt: new Date(Date.now() - 15552000000).toISOString()
  },
  {
    id: 'user-6',
    email: 'admin.prime@nexuscore.io',
    phone: '+15550111',
    status: MemberStatus.ACTIVE,
    mfaEnabled: true,
    role: RoleCode.COMPANY_ADMIN,
    points: 5000,
    createdAt: new Date(Date.now() - 31536000000).toISOString()
  },
  {
    id: 'user-7',
    email: 'finance.lead@nexuscore.io',
    phone: '+15550777',
    status: MemberStatus.ACTIVE,
    mfaEnabled: true,
    role: RoleCode.FINANCE_ADMIN,
    points: 3500,
    createdAt: new Date(Date.now() - 15552000000).toISOString()
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-2',
    authorName: 'Sarah J.',
    title: 'Future of Decentralized Identity',
    content: 'Exploring how NexusCore integrates MFA with on-chain signatures to ensure truly secure creator environments...',
    status: 'PUBLISHED',
    likes: ['user-4', 'user-6'],
    comments: [
      {
        id: 'c-1',
        authorId: 'user-4',
        authorName: 'Elena Rossi',
        content: 'This is exactly what the industry needs. Sovereignty is key!',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    authorName: 'Marketing Team',
    title: 'Product Launch: NexusPay v2',
    content: 'We are excited to announce multi-modal payments are now live for all creators. Support your favorites via Stripe or Crypto.',
    status: 'PUBLISHED',
    likes: ['user-1'],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    authorName: 'Julian Vane',
    title: 'The Sovereign Creator: Navigating the Post-Platform Era',
    excerpt: 'Platform risk is the silent killer of creative careers. Learn how to build on protocols, not products.',
    content: 'Long form content goes here...',
    category: 'STRATEGY',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'blog-2',
    authorName: 'Elena Rossi',
    title: 'Algorithmic Resistance: Why Human Curation Wins',
    excerpt: 'In an AI-saturated world, the human touch becomes the ultimate luxury good. How to leverage taste as a moat.',
    content: 'Long form content goes here...',
    category: 'CULTURE',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: 'blog-3',
    authorName: 'Marcus Chen',
    title: 'Decentralized Treasury: Managing Your Creator Equity',
    excerpt: 'Financial literacy for the digital nomad. Transitioning from monthly tips to long-term asset management.',
    content: 'Long form content goes here...',
    category: 'FINANCE',
    readTime: '12 min read',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2064&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 604800000).toISOString()
  }
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    creatorId: 'user-2',
    name: 'Advanced Tokenomics Guide',
    price: 49.99,
    currency: 'USD',
    acceptedMethods: [PaymentMethod.STRIPE, PaymentMethod.WALLET]
  },
  {
    id: 'prod-2',
    creatorId: 'user-1',
    name: 'Consultation Hour',
    price: 150.00,
    currency: 'USD',
    acceptedMethods: [PaymentMethod.STRIPE, PaymentMethod.LOCAL]
  }
];

export const MOCK_WALLETS: Wallet[] = [
  {
    id: 'w-1',
    ownerId: 'user-1',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    currency: 'USDT',
    balance: 1250.50
  },
  {
    id: 'w-2',
    ownerId: 'user-1',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    currency: 'BTC',
    balance: 0.045
  }
];
