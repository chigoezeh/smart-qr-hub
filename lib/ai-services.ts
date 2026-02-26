"use server";

interface AICompletionOptions {
  prompt: string;
  systemMessage?: string;
  maxTokens?: number;
  temperature?: number;
}

interface TemplateRecommendation {
  template: string;
  confidence: number;
  reasoning: string;
}

interface ContentSuggestion {
  headline: string;
  description: string;
  callToAction: string;
}

export async function getAICompletion({ 
  prompt, 
  systemMessage = "You are a helpful assistant specialized in creating engaging landing page content.",
  maxTokens = 500,
  temperature = 0.7 
}: AICompletionOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("AI completion error:", error);
    throw error;
  }
}

export async function recommendTemplate(industry: string, goals: string[]): Promise<TemplateRecommendation> {
  const prompt = `Given a business in the "${industry}" industry with goals: ${goals.join(", ")}, recommend ONE of these landing page templates:
- biolink: Simple link-in-bio page
- vcard: Digital business card
- restaurant-menu: Restaurant menu display
- real-estate-listing: Property showcase
- portfolio-resume: Portfolio or resume
- event-rsvp: Event registration
- product-launch: Product announcement
- service-booking: Service appointment booking
- donation-campaign: Fundraising page
- newsletter-signup: Email list building

Return ONLY valid JSON in this exact format:
{
  "template": "template-name",
  "confidence": 0.95,
  "reasoning": "Brief explanation of why this template fits"
}`;

  const systemMessage = "You are a landing page template recommendation expert. Always return valid JSON only, no additional text.";
  
  try {
    const result = await getAICompletion({ 
      prompt, 
      systemMessage,
      temperature: 0.3 
    });
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Template recommendation error:", error);
    // Fallback recommendation
    return {
      template: "biolink",
      confidence: 0.5,
      reasoning: "Using default biolink template as fallback"
    };
  }
}

export async function generateContentForTemplate(
  template: string,
  businessInfo: { name: string; industry: string; description?: string }
): Promise<ContentSuggestion> {
  const prompt = `Generate engaging landing page content for a ${template} template for "${businessInfo.name}" in the ${businessInfo.industry} industry.
${businessInfo.description ? `Business description: ${businessInfo.description}` : ""}

Return ONLY valid JSON in this exact format:
{
  "headline": "Catchy headline (max 60 chars)",
  "description": "Compelling description (max 160 chars)",
  "callToAction": "Action button text (max 20 chars)"
}`;

  const systemMessage = "You are a copywriting expert. Always return valid JSON only, no additional text.";
  
  try {
    const result = await getAICompletion({ 
      prompt, 
      systemMessage,
      temperature: 0.8,
      maxTokens: 200
    });
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Content generation error:", error);
    // Fallback content
    return {
      headline: `Welcome to ${businessInfo.name}`,
      description: `Discover what ${businessInfo.name} has to offer in ${businessInfo.industry}.`,
      callToAction: "Learn More"
    };
  }
}

export async function optimizeContent(
  content: string,
  contentType: "headline" | "description" | "cta"
): Promise<string> {
  const prompts = {
    headline: "Rewrite this headline to be more engaging and concise (max 60 characters)",
    description: "Improve this description to be more compelling and action-oriented (max 160 characters)",
    cta: "Suggest a more persuasive call-to-action button text (max 20 characters)"
  };

  const prompt = `${prompts[contentType]}: "${content}"

Return ONLY the improved text, nothing else.`;

  try {
    const result = await getAICompletion({ 
      prompt,
      temperature: 0.7,
      maxTokens: 100
    });
    
    return result.trim().replace(/^["']|["']$/g, ""); // Remove quotes if present
  } catch (error) {
    console.error("Content optimization error:", error);
    return content; // Return original if optimization fails
  }
}

export async function generateMetaDescription(
  pageTitle: string,
  pageContent: string
): Promise<{ title: string; description: string; keywords: string[] }> {
  const prompt = `Based on this landing page:
Title: ${pageTitle}
Content: ${pageContent.substring(0, 500)}

Generate SEO-optimized meta tags. Return ONLY valid JSON in this exact format:
{
  "title": "SEO title (50-60 chars)",
  "description": "Meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

  const systemMessage = "You are an SEO expert. Always return valid JSON only, no additional text.";
  
  try {
    const result = await getAICompletion({ 
      prompt, 
      systemMessage,
      temperature: 0.5,
      maxTokens: 300
    });
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Meta generation error:", error);
    return {
      title: pageTitle,
      description: pageContent.substring(0, 160),
      keywords: []
    };
  }
}

export async function suggestImageKeywords(
  businessName: string,
  industry: string,
  context: string
): Promise<string[]> {
  const prompt = `For a ${industry} business called "${businessName}" with context: "${context}", suggest 5 relevant image search keywords for Unsplash.

Return ONLY valid JSON array: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]`;

  const systemMessage = "You are an image curation expert. Always return valid JSON only, no additional text.";
  
  try {
    const result = await getAICompletion({ 
      prompt, 
      systemMessage,
      temperature: 0.6,
      maxTokens: 100
    });
    
    return JSON.parse(result);
  } catch (error) {
    console.error("Image keyword generation error:", error);
    return [industry, businessName, "professional", "modern", "business"];
  }
}
