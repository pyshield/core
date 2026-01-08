
export enum RoleCode {
  GROUP_ADMIN = 'GROUP_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  CREATOR = 'CREATOR',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF'
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  WALLET = 'WALLET',
  LOCAL = 'LOCAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

export interface OwnershipAsset {
  id: string;
  name: string;
  type: 'IP' | 'CONTRACT' | 'DIGITAL_ART' | 'EQUITY';
  valueEstimate: string;
}

export interface Member {
  id: string;
  email: string;
  phone: string;
  status: MemberStatus;
  mfaEnabled: boolean;
  role: RoleCode;
  createdAt: string;
  bio?: string;
  ownershipManifesto?: string;
  creativeScore?: number;
  points: number; // New field for gamification
  assets?: OwnershipAsset[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  likes: string[]; // User IDs who liked
  comments: Comment[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  authorName: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  creatorId: string;
  name: string;
  price: number;
  currency: string;
  acceptedMethods: PaymentMethod[];
}

export interface Wallet {
  id: string;
  ownerId: string;
  address: string;
  currency: 'USDT' | 'BTC' | 'ETH';
  balance: number;
  securityProtocol?: 'STANDARD' | 'QUANTUM_SHIELD' | 'BIO_LOCKED';
}

export interface PaymentRecord {
  id: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  contextType: 'TIP' | 'PRODUCT' | 'SUBSCRIPTION';
  contextId: string;
  providerRef?: string;
  createdAt: string;
}

export interface AppState {
  currentUser: Member | null;
  currentRole: RoleCode;
  members: Member[];
  posts: Post[];
  blogPosts: BlogPost[];
  products: ProductItem[];
  wallets: Wallet[];
  payments: PaymentRecord[];
}
