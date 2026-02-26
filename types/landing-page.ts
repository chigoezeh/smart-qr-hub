// Landing Page Type Definitions

export type LandingPageCategory = 
  | "general"
  | "restaurant"
  | "realestate"
  | "portfolio"
  | "retail"
  | "healthcare"
  | "events"
  | "education"
  | "fitness"
  | "hospitality"
  | "professional"
  | "creative"
  | "nonprofit";

export type LandingPageTemplate = 
  | "biolink"
  | "vcard"
  | "menu"
  | "property"
  | "resume"
  | "product"
  | "clinic"
  | "event"
  | "course"
  | "trainer"
  | "travel"
  | "service"
  | "gallery"
  | "donation";

export type BlockType =
  | "text"
  | "image"
  | "video"
  | "gallery"
  | "links"
  | "form"
  | "calendar"
  | "map"
  | "menu"
  | "testimonials"
  | "pricing"
  | "faq"
  | "social"
  | "download"
  | "custom";

export type HeaderType = "minimal" | "hero" | "banner" | "video";

export type LinkType = "standard" | "featured" | "button" | "social" | "download";

export type LeadStatus = "new" | "contacted" | "converted" | "archived";

// Block Content Interfaces

export interface TextBlockContent {
  text: string;
  alignment?: "left" | "center" | "right";
  fontSize?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
}

export interface ImageBlockContent {
  url: string;
  alt: string;
  caption?: string;
  link?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

export interface GalleryBlockContent {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  layout?: "grid" | "masonry" | "carousel" | "slider";
  columns?: 2 | 3 | 4;
}

export interface VideoBlockContent {
  url: string;
  provider?: "youtube" | "vimeo" | "direct";
  thumbnail?: string;
  autoplay?: boolean;
}

export interface FormBlockContent {
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "phone" | "textarea" | "select" | "checkbox";
    required?: boolean;
    placeholder?: string;
    options?: string[]; // For select fields
  }>;
  submitButtonText?: string;
  successMessage?: string;
  emailNotification?: {
    to: string;
    subject: string;
  };
}

export interface MenuBlockContent {
  categories: Array<{
    name: string;
    items: Array<{
      name: string;
      description?: string;
      price?: string;
      image?: string;
      allergens?: string[];
      dietary?: string[]; // vegetarian, vegan, gluten-free, etc.
    }>;
  }>;
}

export interface TestimonialBlockContent {
  testimonials: Array<{
    name: string;
    role?: string;
    company?: string;
    avatar?: string;
    quote: string;
    rating?: number;
  }>;
  layout?: "carousel" | "grid" | "list";
}

export interface PricingBlockContent {
  plans: Array<{
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    buttonText?: string;
    buttonUrl?: string;
  }>;
}

export interface FAQBlockContent {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface MapBlockContent {
  address: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  showMarker?: boolean;
}

export interface CalendarBlockContent {
  events: Array<{
    title: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    registrationUrl?: string;
  }>;
  view?: "list" | "calendar";
}

export interface SocialBlockContent {
  platforms: Array<{
    name: string;
    url: string;
    icon?: string;
  }>;
  style?: "icons" | "buttons" | "links";
}

export interface DownloadBlockContent {
  files: Array<{
    name: string;
    description?: string;
    url: string;
    fileType?: string;
    fileSize?: string;
  }>;
}

export interface CustomBlockContent {
  html?: string;
  css?: string;
  javascript?: string;
}

// Union type for all block content
export type BlockContent =
  | TextBlockContent
  | ImageBlockContent
  | GalleryBlockContent
  | VideoBlockContent
  | FormBlockContent
  | MenuBlockContent
  | TestimonialBlockContent
  | PricingBlockContent
  | FAQBlockContent
  | MapBlockContent
  | CalendarBlockContent
  | SocialBlockContent
  | DownloadBlockContent
  | CustomBlockContent;

// Landing Page Block
export interface LandingPageBlock {
  id: number;
  landingPageId: number;
  blockType: BlockType;
  title?: string;
  content: BlockContent;
  displayOrder: number;
  isVisible: boolean;
  backgroundColor?: string;
  textColor?: string;
  customStyles?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Business Info Structure
export interface BusinessInfo {
  name?: string;
  tagline?: string;
  description?: string;
  industry?: string;
  established?: string;
  website?: string;
}

// Contact Info Structure
export interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  hours?: Array<{
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }>;
}

// Template-Specific Settings
export interface TemplateSettings {
  [key: string]: any; // Flexible for different template types
}

// Complete Landing Page
export interface LandingPage {
  id: number;
  workspaceId: number;
  slug: string;
  category: LandingPageCategory;
  template: LandingPageTemplate;
  type: string; // Legacy
  
  // Theme & Styling
  theme: string;
  customCss?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  fontFamily?: string;
  
  // SEO & Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;
  
  // Header
  headerType?: HeaderType;
  headerMediaUrl?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  logoUrl?: string;
  
  // Industry-Specific Data
  businessInfo?: BusinessInfo;
  contactInfo?: ContactInfo;
  settingsData?: TemplateSettings;
  
  // Legacy vCard fields
  fullName?: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  profilePhotoUrl?: string;
  
  // Features
  enableAnalytics: boolean;
  enableLeadCapture: boolean;
  enableAppointments: boolean;
  enablePayments: boolean;
  
  // Visibility
  isPublished: boolean;
  requiresPassword: boolean;
  passwordHash?: string;
  
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Lead Capture
export interface LandingPageLead {
  id: number;
  landingPageId: number;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  customData?: Record<string, any>;
  sourceUrl?: string;
  userAgent?: string;
  ipAddress?: string;
  status: LeadStatus;
  createdAt: Date;
}

// Analytics View
export interface LandingPageView {
  id: number;
  landingPageId: number;
  viewedAt: Date;
  os?: string;
  deviceType?: string;
  country?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timeOnPage?: number;
  blocksViewed?: number[];
  linksClicked?: number[];
  didConvert: boolean;
  conversionType?: string;
}
