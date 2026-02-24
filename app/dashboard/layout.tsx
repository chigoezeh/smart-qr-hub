import { getCurrentWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardNav from "@/components/DashboardNav";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const workspace = await getCurrentWorkspace();

  if (!workspace) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader
        workspaceName={workspace.workspace.name}
        workspacePlan={workspace.workspace.plan}
        userRole={workspace.role}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <DashboardNav />
        
        <main className="flex-1 lg:ml-72 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs />
            </div>
            
            {/* Page Content */}
            <div className="pb-20 lg:pb-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
