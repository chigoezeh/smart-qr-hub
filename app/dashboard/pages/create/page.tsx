import { redirect } from "next/navigation";
import { Suspense } from "react";
import TemplateGallery from "@/components/TemplateGallery";
import CreateLandingPageForm from "@/components/CreateLandingPageForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function CreatePageContent({ searchParams }: { searchParams: { template?: string } }) {
  // If no template is selected, show template gallery
  if (!searchParams.template) {
    return <TemplateGallery />;
  }

  // Otherwise show the create form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/pages/create"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Change Template</span>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Landing Page</h1>
              <p className="text-sm text-gray-600 mt-1">
                Customize your {searchParams.template} page
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CreateLandingPageForm />
      </div>
    </div>
  );
}

export default async function CreateLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreatePageContent searchParams={params} />
    </Suspense>
  );
}
