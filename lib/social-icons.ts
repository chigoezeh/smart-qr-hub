/**
 * Detect social media platform from URL and return appropriate icon
 */
export function getSocialIcon(url: string): string | null {
  const urlLower = url.toLowerCase();

  // Social Media Platforms
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com') || urlLower.includes('fb.me')) {
    return '📘'; // Facebook
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return '𝕏'; // X/Twitter
  }
  if (urlLower.includes('instagram.com') || urlLower.includes('instagr.am')) {
    return '📷'; // Instagram
  }
  if (urlLower.includes('linkedin.com')) {
    return '💼'; // LinkedIn
  }
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return '▶️'; // YouTube
  }
  if (urlLower.includes('tiktok.com')) {
    return '🎵'; // TikTok
  }
  if (urlLower.includes('snapchat.com')) {
    return '👻'; // Snapchat
  }
  if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) {
    return '📌'; // Pinterest
  }
  if (urlLower.includes('reddit.com')) {
    return '🤖'; // Reddit
  }
  if (urlLower.includes('twitch.tv')) {
    return '📺'; // Twitch
  }
  if (urlLower.includes('discord.gg') || urlLower.includes('discord.com')) {
    return '💬'; // Discord
  }
  if (urlLower.includes('telegram.org') || urlLower.includes('t.me')) {
    return '✈️'; // Telegram
  }
  if (urlLower.includes('whatsapp.com') || urlLower.includes('wa.me')) {
    return '💚'; // WhatsApp
  }
  
  // Professional/Business
  if (urlLower.includes('github.com')) {
    return '🐙'; // GitHub
  }
  if (urlLower.includes('gitlab.com')) {
    return '🦊'; // GitLab
  }
  if (urlLower.includes('medium.com')) {
    return '📝'; // Medium
  }
  if (urlLower.includes('substack.com')) {
    return '📰'; // Substack
  }
  if (urlLower.includes('behance.net')) {
    return '🎨'; // Behance
  }
  if (urlLower.includes('dribbble.com')) {
    return '🏀'; // Dribbble
  }
  
  // E-commerce/Payment
  if (urlLower.includes('shopify.com') || urlLower.includes('myshopify.com')) {
    return '🛍️'; // Shopify
  }
  if (urlLower.includes('etsy.com')) {
    return '🧶'; // Etsy
  }
  if (urlLower.includes('paypal.com') || urlLower.includes('paypal.me')) {
    return '💳'; // PayPal
  }
  if (urlLower.includes('venmo.com')) {
    return '💸'; // Venmo
  }
  if (urlLower.includes('cash.app')) {
    return '💵'; // Cash App
  }
  
  // Music/Audio
  if (urlLower.includes('spotify.com') || urlLower.includes('open.spotify.com')) {
    return '🎧'; // Spotify
  }
  if (urlLower.includes('soundcloud.com')) {
    return '☁️'; // SoundCloud
  }
  if (urlLower.includes('apple.com/music') || urlLower.includes('music.apple.com')) {
    return '🍎'; // Apple Music
  }
  
  // Other
  if (urlLower.includes('linktree.com') || urlLower.includes('linktr.ee')) {
    return '🌳'; // Linktree
  }
  if (urlLower.includes('calendly.com')) {
    return '📅'; // Calendly
  }
  if (urlLower.includes('zoom.us')) {
    return '🎥'; // Zoom
  }
  if (urlLower.includes('patreon.com')) {
    return '🎁'; // Patreon
  }
  if (urlLower.includes('onlyfans.com')) {
    return '🔞'; // OnlyFans
  }

  // Default - no specific icon detected
  return null;
}

/**
 * Get platform name from URL
 */
export function getPlatformName(url: string): string | null {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('facebook.com')) return 'Facebook';
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'X (Twitter)';
  if (urlLower.includes('instagram.com')) return 'Instagram';
  if (urlLower.includes('linkedin.com')) return 'LinkedIn';
  if (urlLower.includes('youtube.com')) return 'YouTube';
  if (urlLower.includes('tiktok.com')) return 'TikTok';
  if (urlLower.includes('snapchat.com')) return 'Snapchat';
  if (urlLower.includes('pinterest.com')) return 'Pinterest';
  if (urlLower.includes('reddit.com')) return 'Reddit';
  if (urlLower.includes('twitch.tv')) return 'Twitch';
  if (urlLower.includes('discord.gg') || urlLower.includes('discord.com')) return 'Discord';
  if (urlLower.includes('telegram.org') || urlLower.includes('t.me')) return 'Telegram';
  if (urlLower.includes('whatsapp.com')) return 'WhatsApp';
  if (urlLower.includes('github.com')) return 'GitHub';
  if (urlLower.includes('medium.com')) return 'Medium';
  if (urlLower.includes('spotify.com')) return 'Spotify';
  
  return null;
}

/**
 * Reserved slugs that cannot be used for landing pages
 */
export const RESERVED_SLUGS = [
  // App routes
  'dashboard',
  'api',
  'onboarding',
  'sign-in',
  'sign-up',
  'signin',
  'signup',
  'login',
  'logout',
  'register',
  
  // Dynamic routes
  'q',
  'l',
  'pixel',
  'verify',
  
  // Common reserved words
  'admin',
  'administrator',
  'root',
  'system',
  'app',
  'www',
  'mail',
  'email',
  'ftp',
  'ssh',
  'api',
  'cdn',
  'static',
  'assets',
  'public',
  
  // Brand protection
  'smart-qr-hub',
  'smartqrhub',
  'smart-link',
  'smartlink',
  'qr-hub',
  'qrhub',
  
  // Profanity/inappropriate (basic list)
  'fuck',
  'shit',
  'damn',
  'porn',
  'sex',
  'xxx',
];

/**
 * Check if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}
