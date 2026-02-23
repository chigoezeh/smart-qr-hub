import { db } from "@/db";
import { landingPages, landingPageLinks, landingPageClicks } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Link2, Mail, Phone, MapPin, Building2, Download, Globe } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicLandingPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch landing page
  const [page] = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.slug, slug))
    .limit(1);

  if (!page) {
    notFound();
  }

  // Fetch links for this page
  const links = await db
    .select()
    .from(landingPageLinks)
    .where(eq(landingPageLinks.landingPageId, page.id))
    .orderBy(asc(landingPageLinks.displayOrder));

  // Theme configurations
  const themes = {
    default: {
      container: "bg-gradient-to-br from-blue-50 to-indigo-50",
      card: "bg-white/90 backdrop-blur-sm",
      button: "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300",
      text: "text-gray-900",
      subtext: "text-gray-600",
    },
    dark: {
      container: "bg-gradient-to-br from-gray-900 to-black",
      card: "bg-gray-800/90 backdrop-blur-sm",
      button: "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600",
      text: "text-white",
      subtext: "text-gray-400",
    },
    minimal: {
      container: "bg-white",
      card: "bg-white",
      button: "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300",
      text: "text-gray-900",
      subtext: "text-gray-600",
    },
    gradient: {
      container: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      card: "bg-white/20 backdrop-blur-md",
      button: "bg-white/90 hover:bg-white text-purple-900 border-2 border-white/50",
      text: "text-white",
      subtext: "text-white/90",
    },
    neon: {
      container: "bg-black",
      card: "bg-gray-900/50 backdrop-blur-sm border border-cyan-500/50",
      button: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-2 border-cyan-500",
      text: "text-cyan-400",
      subtext: "text-cyan-300/70",
    },
  };

  const currentTheme = themes[page.theme as keyof typeof themes] || themes.default;

  // Generate vCard download data for vCard pages
  const generateVCard = () => {
    if (page.type !== "vcard") return null;

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${page.fullName || ""}`,
      page.phone ? `TEL:${page.phone}` : "",
      page.email ? `EMAIL:${page.email}` : "",
      page.company ? `ORG:${page.company}` : "",
      page.address ? `ADR:;;${page.address}` : "",
      page.profilePhotoUrl ? `PHOTO;VALUE=uri:${page.profilePhotoUrl}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    return URL.createObjectURL(blob);
  };

  return (
    <div className={`min-h-screen ${currentTheme.container} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className={`${currentTheme.card} rounded-3xl shadow-2xl border border-gray-200/50 p-8 mb-6`}>
          {page.profilePhotoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={page.profilePhotoUrl}
                alt={page.fullName || "Profile"}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
          )}

          <div className="text-center mb-6">
            <h1 className={`text-3xl sm:text-4xl font-bold ${currentTheme.text} mb-2`}>
              {page.type === "vcard" && page.fullName ? page.fullName : `@${page.slug}`}
            </h1>
            {page.company && (
              <p className={`text-lg ${currentTheme.subtext} flex items-center justify-center gap-2`}>
                <Building2 className="w-5 h-5" />
                {page.company}
              </p>
            )}
          </div>

          {/* vCard Contact Info */}
          {page.type === "vcard" && (
            <div className="space-y-3 mb-6">
              {page.email && (
                <a
                  href={`mailto:${page.email}`}
                  className={`flex items-center justify-center gap-2 ${currentTheme.subtext} hover:opacity-80 transition-opacity`}
                >
                  <Mail className="w-5 h-5" />
                  {page.email}
                </a>
              )}
              {page.phone && (
                <a
                  href={`tel:${page.phone}`}
                  className={`flex items-center justify-center gap-2 ${currentTheme.subtext} hover:opacity-80 transition-opacity`}
                >
                  <Phone className="w-5 h-5" />
                  {page.phone}
                </a>
              )}
              {page.address && (
                <div className={`flex items-center justify-center gap-2 ${currentTheme.subtext}`}>
                  <MapPin className="w-5 h-5" />
                  {page.address}
                </div>
              )}

              {/* Download vCard Button */}
              <div className="pt-4">
                <a
                  href={`data:text/vcard;charset=utf-8,${encodeURIComponent([
                    "BEGIN:VCARD",
                    "VERSION:3.0",
                    `FN:${page.fullName || ""}`,
                    page.phone ? `TEL:${page.phone}` : "",
                    page.email ? `EMAIL:${page.email}` : "",
                    page.company ? `ORG:${page.company}` : "",
                    page.address ? `ADR:;;${page.address}` : "",
                    page.profilePhotoUrl ? `PHOTO;VALUE=uri:${page.profilePhotoUrl}` : "",
                    "END:VCARD",
                  ]
                    .filter(Boolean)
                    .join("\n"))}`}
                  download={`${page.slug}.vcf`}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 ${currentTheme.button} rounded-2xl font-semibold shadow-lg transition-all`}
                >
                  <Download className="w-5 h-5" />
                  Save Contact
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Links Section */}
        {links.length > 0 && (
          <div className="space-y-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full px-6 py-4 ${currentTheme.button} rounded-2xl font-semibold shadow-lg transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {link.icon && <span className="text-2xl">{link.icon}</span>}
                    <span>{link.title}</span>
                  </div>
                  <Globe className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-sm ${currentTheme.subtext}`}>
            Powered by{" "}
            <a
              href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
              className="font-semibold hover:opacity-80 transition-opacity"
            >
              Smart-Link Hub
            </a>
          </p>
        </div>
      </div>

      {/* Custom CSS */}
      {page.customCss && (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      )}
    </div>
  );
}
