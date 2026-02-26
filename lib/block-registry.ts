import { BlockType } from "@/types/landing-page";
import { 
  Type, 
  Image, 
  Video, 
  Images, 
  Link2, 
  FileText, 
  Calendar, 
  Map, 
  UtensilsCrossed, 
  MessageSquare, 
  DollarSign, 
  HelpCircle, 
  Share2, 
  Download, 
  Code 
} from "lucide-react";

export interface BlockTypeInfo {
  type: BlockType;
  name: string;
  description: string;
  icon: any;
  category: "content" | "media" | "interactive" | "specialized";
  isProFeature?: boolean;
}

export const BLOCK_TYPES: Record<BlockType, BlockTypeInfo> = {
  text: {
    type: "text",
    name: "Text",
    description: "Rich text content with formatting options",
    icon: Type,
    category: "content",
  },
  image: {
    type: "image",
    name: "Image",
    description: "Single image with caption and link",
    icon: Image,
    category: "media",
  },
  video: {
    type: "video",
    name: "Video",
    description: "Embed YouTube, Vimeo, or upload video",
    icon: Video,
    category: "media",
  },
  gallery: {
    type: "gallery",
    name: "Gallery",
    description: "Photo gallery with multiple layout options",
    icon: Images,
    category: "media",
  },
  links: {
    type: "links",
    name: "Links",
    description: "Collection of clickable links",
    icon: Link2,
    category: "content",
  },
  form: {
    type: "form",
    name: "Contact Form",
    description: "Lead capture form with custom fields",
    icon: FileText,
    category: "interactive",
    isProFeature: true,
  },
  calendar: {
    type: "calendar",
    name: "Calendar",
    description: "Event schedule or calendar view",
    icon: Calendar,
    category: "specialized",
  },
  map: {
    type: "map",
    name: "Map",
    description: "Google Maps location embed",
    icon: Map,
    category: "specialized",
  },
  menu: {
    type: "menu",
    name: "Menu",
    description: "Restaurant menu with categories and pricing",
    icon: UtensilsCrossed,
    category: "specialized",
    isProFeature: true,
  },
  testimonials: {
    type: "testimonials",
    name: "Testimonials",
    description: "Customer reviews and testimonials",
    icon: MessageSquare,
    category: "content",
  },
  pricing: {
    type: "pricing",
    name: "Pricing",
    description: "Pricing tables and plans",
    icon: DollarSign,
    category: "specialized",
  },
  faq: {
    type: "faq",
    name: "FAQ",
    description: "Frequently asked questions accordion",
    icon: HelpCircle,
    category: "content",
  },
  social: {
    type: "social",
    name: "Social Links",
    description: "Social media profile links",
    icon: Share2,
    category: "content",
  },
  download: {
    type: "download",
    name: "Downloads",
    description: "Downloadable files and documents",
    icon: Download,
    category: "content",
  },
  custom: {
    type: "custom",
    name: "Custom HTML",
    description: "Custom HTML/CSS/JavaScript code",
    icon: Code,
    category: "specialized",
    isProFeature: true,
  },
};

export function getBlockTypeInfo(blockType: BlockType): BlockTypeInfo {
  return BLOCK_TYPES[blockType];
}

export function getBlockTypesByCategory(category: "content" | "media" | "interactive" | "specialized"): BlockTypeInfo[] {
  return Object.values(BLOCK_TYPES).filter((block) => block.category === category);
}

export function getAllBlockTypes(): BlockTypeInfo[] {
  return Object.values(BLOCK_TYPES);
}
