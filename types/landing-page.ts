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

// ============================================================================
// ADVANCED PAGE BUILDER TYPES
// ============================================================================

// Device Breakpoints
export type DeviceBreakpoint = "mobile" | "tablet" | "desktop";

// Element Types (Container Hierarchy)
export type ElementType = "section" | "container" | "column" | "block";

// Layout Types
export type LayoutType = "stack" | "flex" | "grid";

// Spacing (for margin/padding)
export interface Spacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Responsive Spacing (per breakpoint)
export interface ResponsiveSpacing {
  mobile: Spacing;
  tablet: Spacing;
  desktop: Spacing;
}

// Border Configuration
export interface BorderConfig {
  width: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  style: "none" | "solid" | "dashed" | "dotted" | "double";
  color: string;
  radius?: BorderRadius;
}

// Border Radius
export interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

// Box Shadow
export interface BoxShadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

// Layout Configuration
export interface LayoutConfig {
  type: LayoutType;
  
  // Flex properties
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: number;
  
  // Grid properties
  gridTemplateColumns?: string; // e.g., "1fr 1fr 1fr" or "repeat(3, 1fr)"
  gridTemplateRows?: string;
  gridAutoFlow?: "row" | "column" | "dense" | "row dense" | "column dense";
  gridGap?: number;
  
  // Container width
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | number;
  minHeight?: string | number;
  
  // Responsive columns (for quick layouts)
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// Style Configuration
export interface StyleConfig {
  // Spacing
  padding?: Spacing | ResponsiveSpacing;
  margin?: Spacing | ResponsiveSpacing;
  
  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "auto" | "cover" | "contain";
  backgroundPosition?: string;
  backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  backgroundAttachment?: "scroll" | "fixed" | "local";
  backgroundOverlay?: {
    color: string;
    opacity: number;
  };
  
  // Text
  textColor?: string;
  
  // Border & Shadow
  border?: BorderConfig;
  borderRadius?: BorderRadius | number; // number for all corners
  boxShadow?: BoxShadow[];
  
  // Display
  display?: "block" | "flex" | "grid" | "inline-block" | "none";
  opacity?: number;
  zIndex?: number;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  
  // Position
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  
  // Flexbox Item Properties (when element is inside a flex container)
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  order?: number;
  alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  
  // Effects
  parallax?: ParallaxConfig;
}

// Responsive Configuration (per breakpoint)
export interface ResponsiveConfig {
  mobile?: {
    display?: "block" | "flex" | "grid" | "none";
    width?: string;
    fontSize?: string;
    padding?: Spacing;
    margin?: Spacing;
    layoutConfig?: Partial<LayoutConfig>;
  };
  tablet?: {
    display?: "block" | "flex" | "grid" | "none";
    width?: string;
    fontSize?: string;
    padding?: Spacing;
    margin?: Spacing;
    layoutConfig?: Partial<LayoutConfig>;
  };
  desktop?: {
    display?: "block" | "flex" | "grid" | "none";
    width?: string;
    fontSize?: string;
    padding?: Spacing;
    margin?: Spacing;
    layoutConfig?: Partial<LayoutConfig>;
  };
}

// Animation State
export interface AnimationState {
  opacity?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  skewX?: number;
  skewY?: number;
}

// Scroll Animation Configuration
export interface ScrollAnimationConfig {
  enabled: boolean;
  type: "fade" | "slide" | "zoom" | "rotate";
  slideDirection?: "up" | "down" | "left" | "right";
  duration: number; // milliseconds
  delay?: number; // milliseconds
  easing: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
  triggerPoint: number; // 0-100% of viewport
  triggerEvent?: "enter" | "exit" | "enter-exit";
}

// Hover Effect Configuration
export interface HoverEffectConfig {
  enabled: boolean;
  duration: number; // milliseconds
  easing: string;
  scale?: number;
  transform?: string;
  boxShadow?: string;
  backgroundColor?: string;
  borderColor?: string;
  opacity?: number; // 0-100
}

// Parallax Configuration
export interface ParallaxConfig {
  enabled: boolean;
  speed: number; // -1 to 1
  axis: "y" | "x" | "both";
  scale?: boolean;
  opacity?: boolean;
}

// Animation Configuration (combines all animation types)
export interface AnimationConfig {
  scroll?: ScrollAnimationConfig;
  hover?: HoverEffectConfig;
  parallax?: ParallaxConfig;
}

// Page Element (Container or Block)
export interface PageElement {
  id: string; // UUID for client-side management
  type: ElementType;
  
  // Layout & Style
  layoutConfig?: LayoutConfig;
  styleConfig?: StyleConfig;
  responsiveConfig?: ResponsiveConfig;
  animationConfig?: AnimationConfig;
  
  // Hierarchy
  parentId?: string;
  children: PageElement[];
  displayOrder: number;
  
  // Block-specific data (only if type === "block")
  blockType?: BlockType;
  blockTitle?: string;
  blockContent?: BlockContent;
  
  // Container-specific
  containerName?: string; // User-friendly name for sections/containers
  
  // Visibility
  isVisible: boolean;
  
  // Custom classes/ID
  customClassName?: string;
  customId?: string;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

// Page Structure (root container)
export interface PageStructure {
  version: string; // Schema version for migrations
  root: PageElement;
  metadata?: {
    lastEditedBy?: number;
    lastEditedAt?: Date;
  };
}

// Quick Layout Presets
export type LayoutPreset =
  | "single-column"
  | "two-column-equal"
  | "two-column-60-40"
  | "two-column-40-60"
  | "two-column-70-30"
  | "two-column-30-70"
  | "three-column-equal"
  | "three-column-50-25-25"
  | "three-column-25-50-25"
  | "four-column-equal"
  | "custom-grid";

// Section Template (pre-built sections)
export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: "hero" | "features" | "cta" | "content" | "testimonials" | "pricing" | "footer" | "custom";
  thumbnail?: string;
  structure: PageElement;
  tags: string[];
  isPremium?: boolean;
}

// Saved Component (reusable user components)
export interface SavedComponent {
  id: number;
  workspaceId: number;
  name: string;
  description?: string;
  thumbnail?: string;
  componentData: PageElement;
  category?: string;
  isPublic: boolean;
  createdBy: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Design System / Tokens
export interface DesignTokens {
  colors: {
    primary: Record<number, string>; // 50, 100, 200, ..., 900
    secondary: Record<number, string>;
    accent: Record<number, string>;
    neutral: Record<number, string>;
    custom: Record<string, string>;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    scale: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
    };
    weights: Record<string, number>;
    lineHeights: Record<string, number>;
  };
  spacing: Record<number, number>; // 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    full: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    inner: string;
  };
}

// Page Version (for version history)
export interface PageVersion {
  id: number;
  landingPageId: number;
  versionNumber: number;
  pageStructure: PageStructure;
  settings: Partial<LandingPage>;
  changedBy: number;
  changeDescription?: string;
  createdAt: Date;
}

// Media Library Asset
export interface MediaAsset {
  id: number;
  workspaceId: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  altText?: string;
  tags: string[];
  folder?: string;
  uploadedBy: number;
  createdAt: Date;
  updatedAt: Date;
}
