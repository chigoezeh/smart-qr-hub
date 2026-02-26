import { LandingPageCategory, LandingPageTemplate, BlockType } from "@/types/landing-page";

// Template Metadata
export interface TemplateConfig {
  id: LandingPageTemplate;
  name: string;
  description: string;
  category: LandingPageCategory;
  icon: string; // Lucide icon name
  color: string; // Tailwind gradient classes
  preview?: string; // Preview image URL
  isPro?: boolean; // Requires pro plan
  
  // Default configuration
  defaultBlocks: Array<{
    type: BlockType;
    title?: string;
    content: any;
    displayOrder: number;
  }>;
  
  defaultTheme: string;
  defaultColors: {
    primary: string;
    secondary: string;
  };
  defaultFontFamily: string;
  
  // Template-specific features
  features: string[];
  recommendedFor: string[];
}

// Template Registry
export const TEMPLATE_REGISTRY: Record<LandingPageTemplate, TemplateConfig> = {
  // GENERAL CATEGORY
  biolink: {
    id: "biolink",
    name: "Bio Link",
    description: "Instagram-style link-in-bio with multiple links",
    category: "general",
    icon: "Link2",
    color: "from-blue-500 to-cyan-500",
    defaultBlocks: [
      {
        type: "text",
        title: "About Me",
        content: {
          text: "Welcome to my link hub! Find all my important links below.",
          alignment: "center",
          fontSize: "base",
        },
        displayOrder: 0,
      },
      {
        type: "links",
        title: "My Links",
        content: { links: [] },
        displayOrder: 1,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#3B82F6",
      secondary: "#06B6D4",
    },
    defaultFontFamily: "Inter",
    features: ["Link aggregation", "Social media integration", "Click tracking"],
    recommendedFor: ["Content creators", "Influencers", "Social media users"],
  },

  vcard: {
    id: "vcard",
    name: "Digital Business Card",
    description: "Professional vCard with contact info and one-tap save",
    category: "general",
    icon: "User",
    color: "from-purple-500 to-pink-500",
    defaultBlocks: [
      {
        type: "text",
        title: "Bio",
        content: {
          text: "Professional. Passionate. Connected.",
          alignment: "center",
          fontSize: "lg",
        },
        displayOrder: 0,
      },
      {
        type: "social",
        title: "Connect With Me",
        content: {
          platforms: [],
          style: "icons",
        },
        displayOrder: 1,
      },
    ],
    defaultTheme: "minimal",
    defaultColors: {
      primary: "#8B5CF6",
      secondary: "#EC4899",
    },
    defaultFontFamily: "Inter",
    features: ["Downloadable vCard", "One-tap contact save", "QR code sharing"],
    recommendedFor: ["Professionals", "Networkers", "Sales teams"],
  },

  // RESTAURANT CATEGORY
  menu: {
    id: "menu",
    name: "Restaurant Menu",
    description: "Digital menu with photos, prices, and categories",
    category: "restaurant",
    icon: "UtensilsCrossed",
    color: "from-orange-500 to-red-500",
    defaultBlocks: [
      {
        type: "image",
        title: "Restaurant Photo",
        content: {
          url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
          alt: "Restaurant interior",
          aspectRatio: "video",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Welcome",
        content: {
          text: "Welcome to our restaurant! Explore our delicious menu below.",
          alignment: "center",
          fontSize: "lg",
        },
        displayOrder: 1,
      },
      {
        type: "menu",
        title: "Our Menu",
        content: {
          categories: [
            {
              name: "Appetizers",
              items: [],
            },
            {
              name: "Main Courses",
              items: [],
            },
            {
              name: "Desserts",
              items: [],
            },
          ],
        },
        displayOrder: 2,
      },
    ],
    defaultTheme: "gradient",
    defaultColors: {
      primary: "#F97316",
      secondary: "#EF4444",
    },
    defaultFontFamily: "Poppins",
    features: ["Menu categories", "Item photos", "Allergen labels", "Pricing"],
    recommendedFor: ["Restaurants", "Cafes", "Food trucks", "Catering"],
  },

  // REAL ESTATE CATEGORY
  property: {
    id: "property",
    name: "Property Showcase",
    description: "Real estate listing with photos, details, and virtual tours",
    category: "realestate",
    icon: "Home",
    color: "from-green-500 to-emerald-600",
    defaultBlocks: [
      {
        type: "gallery",
        title: "Property Photos",
        content: {
          images: [],
          layout: "carousel",
          columns: 3,
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Property Description",
        content: {
          text: "Beautiful property in prime location.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "pricing",
        title: "Details",
        content: {
          plans: [],
        },
        displayOrder: 2,
      },
      {
        type: "map",
        title: "Location",
        content: {
          address: "",
          zoom: 15,
          showMarker: true,
        },
        displayOrder: 3,
      },
      {
        type: "form",
        title: "Schedule a Viewing",
        content: {
          fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "phone", required: true },
            { name: "message", label: "Preferred Date/Time", type: "textarea", required: false },
          ],
          submitButtonText: "Request Viewing",
          successMessage: "Thanks! We'll contact you soon to schedule your viewing.",
        },
        displayOrder: 4,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#10B981",
      secondary: "#059669",
    },
    defaultFontFamily: "Inter",
    features: ["Photo galleries", "Virtual tours", "Property details", "Contact forms"],
    recommendedFor: ["Realtors", "Property managers", "Developers"],
    isPro: true,
  },

  // PORTFOLIO CATEGORY
  resume: {
    id: "resume",
    name: "Interactive Resume",
    description: "Digital CV with work history, skills, and portfolio",
    category: "portfolio",
    icon: "Briefcase",
    color: "from-indigo-500 to-blue-600",
    defaultBlocks: [
      {
        type: "text",
        title: "Professional Summary",
        content: {
          text: "Experienced professional with a passion for innovation.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Work Experience",
        content: {
          text: "**Senior Developer** - Tech Co. (2020-Present)\n\nLed development of key products.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "download",
        title: "Documents",
        content: {
          files: [
            {
              name: "Resume PDF",
              description: "Download my full resume",
              url: "",
              fileType: "PDF",
            },
          ],
        },
        displayOrder: 2,
      },
      {
        type: "form",
        title: "Get In Touch",
        content: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "message", label: "Message", type: "textarea", required: true },
          ],
          submitButtonText: "Send Message",
          successMessage: "Thanks for reaching out! I'll get back to you soon.",
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "minimal",
    defaultColors: {
      primary: "#6366F1",
      secondary: "#3B82F6",
    },
    defaultFontFamily: "Inter",
    features: ["Work timeline", "Skills showcase", "Portfolio gallery", "PDF download"],
    recommendedFor: ["Job seekers", "Freelancers", "Consultants"],
  },

  // RETAIL CATEGORY
  product: {
    id: "product",
    name: "Product Page",
    description: "E-commerce product landing with photos and purchase links",
    category: "retail",
    icon: "ShoppingBag",
    color: "from-pink-500 to-rose-600",
    defaultBlocks: [
      {
        type: "gallery",
        title: "Product Photos",
        content: {
          images: [],
          layout: "grid",
          columns: 2,
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Product Description",
        content: {
          text: "Premium quality product with exceptional features.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "testimonials",
        title: "Customer Reviews",
        content: {
          testimonials: [],
          layout: "grid",
        },
        displayOrder: 2,
      },
      {
        type: "links",
        title: "Buy Now",
        content: { links: [] },
        displayOrder: 3,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#EC4899",
      secondary: "#F43F5E",
    },
    defaultFontFamily: "Poppins",
    features: ["Product galleries", "Reviews", "Purchase links", "Variants"],
    recommendedFor: ["E-commerce stores", "Retailers", "Product launches"],
  },

  // HEALTHCARE CATEGORY
  clinic: {
    id: "clinic",
    name: "Medical Practice",
    description: "Healthcare provider info with appointment booking",
    category: "healthcare",
    icon: "Heart",
    color: "from-teal-500 to-cyan-600",
    defaultBlocks: [
      {
        type: "text",
        title: "About Our Practice",
        content: {
          text: "Providing quality healthcare with compassion.",
          alignment: "center",
          fontSize: "lg",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Services",
        content: {
          text: "• General checkups\n• Preventive care\n• Specialist consultations",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "form",
        title: "Book Appointment",
        content: {
          fields: [
            { name: "name", label: "Patient Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "phone", required: true },
            { name: "reason", label: "Reason for Visit", type: "textarea", required: false },
          ],
          submitButtonText: "Request Appointment",
          successMessage: "Appointment request received. We'll confirm shortly.",
        },
        displayOrder: 2,
      },
      {
        type: "map",
        title: "Our Location",
        content: {
          address: "",
          zoom: 16,
          showMarker: true,
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#14B8A6",
      secondary: "#06B6D4",
    },
    defaultFontFamily: "Inter",
    features: ["Appointment booking", "Services list", "Doctor profiles", "Office hours"],
    recommendedFor: ["Doctors", "Clinics", "Healthcare providers"],
    isPro: true,
  },

  // EVENTS CATEGORY
  event: {
    id: "event",
    name: "Event Hub",
    description: "Conference or event page with schedule and registration",
    category: "events",
    icon: "Calendar",
    color: "from-violet-500 to-purple-600",
    defaultBlocks: [
      {
        type: "image",
        title: "Event Banner",
        content: {
          url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
          alt: "Event photo",
          aspectRatio: "video",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "About the Event",
        content: {
          text: "Join us for an unforgettable experience!",
          alignment: "center",
          fontSize: "xl",
        },
        displayOrder: 1,
      },
      {
        type: "calendar",
        title: "Schedule",
        content: {
          events: [],
          view: "list",
        },
        displayOrder: 2,
      },
      {
        type: "form",
        title: "Register",
        content: {
          fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "company", label: "Company", type: "text", required: false },
          ],
          submitButtonText: "Register Now",
          successMessage: "Registration successful! Check your email for details.",
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "gradient",
    defaultColors: {
      primary: "#8B5CF6",
      secondary: "#A855F7",
    },
    defaultFontFamily: "Poppins",
    features: ["Event schedule", "Speaker profiles", "Registration forms", "Venue maps"],
    recommendedFor: ["Event planners", "Conference organizers", "Meetups"],
  },

  // EDUCATION CATEGORY
  course: {
    id: "course",
    name: "Course Overview",
    description: "Educational course page with curriculum and enrollment",
    category: "education",
    icon: "GraduationCap",
    color: "from-blue-600 to-indigo-700",
    defaultBlocks: [
      {
        type: "text",
        title: "Course Description",
        content: {
          text: "Master new skills with our comprehensive course.",
          alignment: "left",
          fontSize: "lg",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "What You'll Learn",
        content: {
          text: "• Skill 1\n• Skill 2\n• Skill 3",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "video",
        title: "Course Preview",
        content: {
          url: "",
          provider: "youtube",
        },
        displayOrder: 2,
      },
      {
        type: "form",
        title: "Enroll Now",
        content: {
          fields: [
            { name: "name", label: "Full Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
          ],
          submitButtonText: "Enroll",
          successMessage: "Enrollment successful! Check your email for course access.",
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#2563EB",
      secondary: "#4F46E5",
    },
    defaultFontFamily: "Inter",
    features: ["Course curriculum", "Video lessons", "Instructor bios", "Enrollment forms"],
    recommendedFor: ["Educators", "Online courses", "Training programs"],
  },

  // FITNESS CATEGORY
  trainer: {
    id: "trainer",
    name: "Trainer Profile",
    description: "Personal trainer page with services and booking",
    category: "fitness",
    icon: "Dumbbell",
    color: "from-red-500 to-orange-600",
    defaultBlocks: [
      {
        type: "image",
        title: "Trainer Photo",
        content: {
          url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
          alt: "Fitness trainer",
          aspectRatio: "square",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "About Me",
        content: {
          text: "Certified fitness trainer helping you achieve your goals.",
          alignment: "center",
          fontSize: "lg",
        },
        displayOrder: 1,
      },
      {
        type: "pricing",
        title: "Training Packages",
        content: {
          plans: [],
        },
        displayOrder: 2,
      },
      {
        type: "form",
        title: "Book a Session",
        content: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "phone", required: true },
            { name: "goals", label: "Fitness Goals", type: "textarea", required: false },
          ],
          submitButtonText: "Book Consultation",
          successMessage: "Request received! I'll contact you to schedule your session.",
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "dark",
    defaultColors: {
      primary: "#EF4444",
      secondary: "#F97316",
    },
    defaultFontFamily: "Poppins",
    features: ["Training packages", "Progress tracking", "Workout videos", "Nutrition plans"],
    recommendedFor: ["Personal trainers", "Fitness coaches", "Gyms"],
  },

  // HOSPITALITY CATEGORY
  travel: {
    id: "travel",
    name: "Travel Guide",
    description: "Destination guide with activities and bookings",
    category: "hospitality",
    icon: "Plane",
    color: "from-sky-500 to-blue-600",
    defaultBlocks: [
      {
        type: "gallery",
        title: "Destination Photos",
        content: {
          images: [],
          layout: "masonry",
          columns: 3,
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "About This Destination",
        content: {
          text: "Discover amazing experiences in this beautiful location.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "map",
        title: "Location",
        content: {
          address: "",
          zoom: 12,
          showMarker: true,
        },
        displayOrder: 2,
      },
      {
        type: "links",
        title: "Book Activities",
        content: { links: [] },
        displayOrder: 3,
      },
    ],
    defaultTheme: "gradient",
    defaultColors: {
      primary: "#0EA5E9",
      secondary: "#3B82F6",
    },
    defaultFontFamily: "Poppins",
    features: ["Activity booking", "Interactive maps", "Photo galleries", "Travel tips"],
    recommendedFor: ["Hotels", "Tour operators", "Travel agencies"],
  },

  // PROFESSIONAL CATEGORY
  service: {
    id: "service",
    name: "Service Provider",
    description: "Professional services page with portfolio and contact",
    category: "professional",
    icon: "Briefcase",
    color: "from-gray-700 to-slate-800",
    defaultBlocks: [
      {
        type: "text",
        title: "What I Do",
        content: {
          text: "Professional services tailored to your needs.",
          alignment: "center",
          fontSize: "xl",
        },
        displayOrder: 0,
      },
      {
        type: "text",
        title: "Services Offered",
        content: {
          text: "• Consulting\n• Strategy\n• Implementation",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 1,
      },
      {
        type: "testimonials",
        title: "Client Testimonials",
        content: {
          testimonials: [],
          layout: "carousel",
        },
        displayOrder: 2,
      },
      {
        type: "form",
        title: "Get a Quote",
        content: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "company", label: "Company", type: "text", required: false },
            { name: "project", label: "Project Details", type: "textarea", required: true },
          ],
          submitButtonText: "Request Quote",
          successMessage: "Thanks! I'll review your request and get back to you shortly.",
        },
        displayOrder: 3,
      },
    ],
    defaultTheme: "minimal",
    defaultColors: {
      primary: "#374151",
      secondary: "#1F2937",
    },
    defaultFontFamily: "Inter",
    features: ["Service listings", "Case studies", "Testimonials", "Contact forms"],
    recommendedFor: ["Consultants", "Agencies", "Freelancers"],
  },

  // CREATIVE CATEGORY
  gallery: {
    id: "gallery",
    name: "Artist Gallery",
    description: "Creative portfolio with artwork showcase",
    category: "creative",
    icon: "Palette",
    color: "from-fuchsia-500 to-pink-600",
    defaultBlocks: [
      {
        type: "text",
        title: "Artist Statement",
        content: {
          text: "Exploring creativity through visual expression.",
          alignment: "center",
          fontSize: "lg",
        },
        displayOrder: 0,
      },
      {
        type: "gallery",
        title: "Portfolio",
        content: {
          images: [],
          layout: "masonry",
          columns: 3,
        },
        displayOrder: 1,
      },
      {
        type: "links",
        title: "Shop & Connect",
        content: { links: [] },
        displayOrder: 2,
      },
    ],
    defaultTheme: "minimal",
    defaultColors: {
      primary: "#D946EF",
      secondary: "#EC4899",
    },
    defaultFontFamily: "Playfair Display",
    features: ["Portfolio galleries", "Exhibition calendar", "Shop integration", "Commission forms"],
    recommendedFor: ["Artists", "Photographers", "Designers", "Musicians"],
  },

  // NONPROFIT CATEGORY
  donation: {
    id: "donation",
    name: "Donation Campaign",
    description: "Fundraising page with impact stories and donate buttons",
    category: "nonprofit",
    icon: "Heart",
    color: "from-green-600 to-teal-600",
    defaultBlocks: [
      {
        type: "text",
        title: "Our Mission",
        content: {
          text: "Making a difference in the lives of those we serve.",
          alignment: "center",
          fontSize: "xl",
        },
        displayOrder: 0,
      },
      {
        type: "image",
        title: "Impact Photo",
        content: {
          url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
          alt: "Community impact",
          aspectRatio: "video",
        },
        displayOrder: 1,
      },
      {
        type: "text",
        title: "How You Can Help",
        content: {
          text: "Your donation makes a real impact in our community.",
          alignment: "left",
          fontSize: "base",
        },
        displayOrder: 2,
      },
      {
        type: "links",
        title: "Donate Now",
        content: { links: [] },
        displayOrder: 3,
      },
      {
        type: "form",
        title: "Get Updates",
        content: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
          ],
          submitButtonText: "Subscribe",
          successMessage: "Thanks for subscribing! We'll keep you updated on our impact.",
        },
        displayOrder: 4,
      },
    ],
    defaultTheme: "default",
    defaultColors: {
      primary: "#059669",
      secondary: "#0D9488",
    },
    defaultFontFamily: "Inter",
    features: ["Donation buttons", "Impact metrics", "Success stories", "Newsletter signup"],
    recommendedFor: ["Nonprofits", "Charities", "Fundraisers", "Causes"],
    isPro: true,
  },
};

// Helper: Get template by ID
export function getTemplate(templateId: LandingPageTemplate): TemplateConfig {
  return TEMPLATE_REGISTRY[templateId];
}

// Helper: Get all templates by category
export function getTemplatesByCategory(category: LandingPageCategory): TemplateConfig[] {
  return Object.values(TEMPLATE_REGISTRY).filter((t) => t.category === category);
}

// Helper: Get all categories
export function getAllCategories(): Array<{ id: LandingPageCategory; name: string; count: number }> {
  const categories = [
    { id: "general" as LandingPageCategory, name: "General" },
    { id: "restaurant" as LandingPageCategory, name: "Restaurant & Food" },
    { id: "realestate" as LandingPageCategory, name: "Real Estate" },
    { id: "portfolio" as LandingPageCategory, name: "Portfolio & Resume" },
    { id: "retail" as LandingPageCategory, name: "Retail & E-commerce" },
    { id: "healthcare" as LandingPageCategory, name: "Healthcare" },
    { id: "events" as LandingPageCategory, name: "Events" },
    { id: "education" as LandingPageCategory, name: "Education" },
    { id: "fitness" as LandingPageCategory, name: "Fitness & Wellness" },
    { id: "hospitality" as LandingPageCategory, name: "Hospitality & Tourism" },
    { id: "professional" as LandingPageCategory, name: "Professional Services" },
    { id: "creative" as LandingPageCategory, name: "Creative & Arts" },
    { id: "nonprofit" as LandingPageCategory, name: "Nonprofit" },
  ];

  return categories.map((cat) => ({
    ...cat,
    count: getTemplatesByCategory(cat.id).length,
  }));
}

// Helper: Search templates
export function searchTemplates(query: string): TemplateConfig[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(TEMPLATE_REGISTRY).filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.features.some((f) => f.toLowerCase().includes(lowerQuery)) ||
      t.recommendedFor.some((r) => r.toLowerCase().includes(lowerQuery))
  );
}
