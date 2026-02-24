"use client";

import { LandingPageBlock } from "@/types/landing-page";
import { 
  TextBlockContent, 
  ImageBlockContent, 
  GalleryBlockContent,
  VideoBlockContent,
  FormBlockContent,
  MenuBlockContent,
  TestimonialBlockContent,
  PricingBlockContent,
  FAQBlockContent,
  MapBlockContent,
  SocialBlockContent,
  DownloadBlockContent,
} from "@/types/landing-page";

// Block Renderer Props
interface BlockRendererProps {
  block: LandingPageBlock;
  isPreview?: boolean;
}

// TEXT BLOCK
export function TextBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as TextBlockContent;
  
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[content.alignment || "left"];
  
  const fontSizeClass = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  }[content.fontSize || "base"];
  
  const fontWeightClass = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  }[content.fontWeight || "normal"];

  return (
    <div 
      className={`block-text ${alignmentClass} ${fontSizeClass} ${fontWeightClass} whitespace-pre-wrap`}
      style={{
        backgroundColor: block.backgroundColor || undefined,
        color: block.textColor || undefined,
      }}
    >
      {content.text}
    </div>
  );
}

// IMAGE BLOCK
export function ImageBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as ImageBlockContent;
  
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[content.aspectRatio || "video"];

  const imageContent = (
    <div className="block-image">
      <div className={`relative ${aspectRatioClass} overflow-hidden rounded-xl`}>
        <img 
          src={content.url} 
          alt={content.alt || ""} 
          className="w-full h-full object-cover"
        />
      </div>
      {content.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center">{content.caption}</p>
      )}
    </div>
  );

  if (content.link && !isPreview) {
    return (
      <a href={content.link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
        {imageContent}
      </a>
    );
  }

  return imageContent;
}

// GALLERY BLOCK
export function GalleryBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as GalleryBlockContent;
  
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[content.columns || 3];

  if (content.layout === "carousel" || content.layout === "slider") {
    return (
      <div className="block-gallery">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {content.images.map((image, idx) => (
            <div key={idx} className="flex-none w-80 snap-center">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img 
                  src={image.url} 
                  alt={image.alt || ""} 
                  className="w-full h-full object-cover"
                />
              </div>
              {image.caption && (
                <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="block-gallery">
      <div className={`grid ${gridCols} gap-4`}>
        {content.images.map((image, idx) => (
          <div key={idx}>
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <img 
                src={image.url} 
                alt={image.alt || ""} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {image.caption && (
              <p className="text-sm text-gray-600 mt-2">{image.caption}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// VIDEO BLOCK
export function VideoBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as VideoBlockContent;
  
  const getEmbedUrl = (url: string, provider?: string) => {
    if (provider === "youtube") {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (provider === "vimeo") {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(content.url, content.provider);

  return (
    <div className="block-video">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {content.provider === "direct" ? (
          <video 
            src={content.url} 
            controls 
            autoPlay={content.autoplay}
            className="w-full h-full"
            poster={content.thumbnail}
          />
        ) : (
          <iframe 
            src={embedUrl} 
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

// SOCIAL LINKS BLOCK
export function SocialBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as SocialBlockContent;

  if (content.style === "icons") {
    return (
      <div className="block-social flex justify-center gap-4">
        {content.platforms.map((platform, idx) => (
          <a 
            key={idx}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label={platform.name}
          >
            {platform.icon || platform.name.charAt(0).toUpperCase()}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="block-social flex flex-col gap-3">
      {content.platforms.map((platform, idx) => (
        <a 
          key={idx}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-center font-medium transition-colors"
        >
          {platform.name}
        </a>
      ))}
    </div>
  );
}

// TESTIMONIALS BLOCK
export function TestimonialsBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as TestimonialBlockContent;

  return (
    <div className="block-testimonials">
      <div className={content.layout === "grid" ? "grid md:grid-cols-2 gap-6" : "flex flex-col gap-6"}>
        {content.testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              {testimonial.avatar && (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                {testimonial.role && (
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-700 italic">&ldquo;{testimonial.quote}&rdquo;</p>
            {testimonial.rating && (
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < testimonial.rating! ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// PRICING BLOCK
export function PricingBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as PricingBlockContent;

  return (
    <div className="block-pricing">
      <div className="grid md:grid-cols-3 gap-6">
        {content.plans.map((plan, idx) => (
          <div 
            key={idx}
            className={`rounded-2xl p-6 border-2 ${
              plan.highlighted 
                ? "border-blue-500 bg-blue-50 shadow-xl" 
                : "border-gray-200 bg-white"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="text-3xl font-bold mb-1">
              {plan.price}
              {plan.period && <span className="text-base font-normal text-gray-600">/{plan.period}</span>}
            </div>
            {plan.description && (
              <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
            )}
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.buttonUrl && (
              <a 
                href={plan.buttonUrl}
                className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-colors ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.buttonText || "Get Started"}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ BLOCK
export function FAQBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as FAQBlockContent;

  return (
    <div className="block-faq space-y-4">
      {content.faqs.map((faq, idx) => (
        <details key={idx} className="bg-white rounded-xl p-6 border border-gray-200">
          <summary className="font-semibold cursor-pointer hover:text-blue-600">
            {faq.question}
          </summary>
          <p className="mt-3 text-gray-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

// MAP BLOCK
export function MapBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as MapBlockContent;
  
  const mapUrl = content.latitude && content.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${content.latitude},${content.longitude}&zoom=${content.zoom || 15}`
    : `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(content.address)}&zoom=${content.zoom || 15}`;

  return (
    <div className="block-map">
      <div className="aspect-video rounded-xl overflow-hidden">
        <iframe 
          src={mapUrl}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">{content.address}</p>
    </div>
  );
}

// DOWNLOAD BLOCK
export function DownloadBlock({ block, isPreview }: BlockRendererProps) {
  const content = block.content as DownloadBlockContent;

  return (
    <div className="block-download space-y-3">
      {content.files.map((file, idx) => (
        <a 
          key={idx}
          href={file.url}
          download
          className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div>
            <div className="font-semibold">{file.name}</div>
            {file.description && (
              <div className="text-sm text-gray-600">{file.description}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {file.fileSize && (
              <span className="text-sm text-gray-500">{file.fileSize}</span>
            )}
            <span className="text-blue-600">↓</span>
          </div>
        </a>
      ))}
    </div>
  );
}

// MAIN BLOCK RENDERER
export default function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
  if (!block.isVisible && !isPreview) {
    return null;
  }

  const blockMap: Record<string, React.ComponentType<BlockRendererProps>> = {
    text: TextBlock,
    image: ImageBlock,
    gallery: GalleryBlock,
    video: VideoBlock,
    social: SocialBlock,
    testimonials: TestimonialsBlock,
    pricing: PricingBlock,
    faq: FAQBlock,
    map: MapBlock,
    download: DownloadBlock,
  };

  const BlockComponent = blockMap[block.blockType];
  
  if (!BlockComponent) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
        Block type "{block.blockType}" not yet implemented
      </div>
    );
  }

  return (
    <div className="landing-page-block py-6">
      {block.title && (
        <h2 className="text-2xl font-bold mb-4">{block.title}</h2>
      )}
      <BlockComponent block={block} isPreview={isPreview} />
    </div>
  );
}
