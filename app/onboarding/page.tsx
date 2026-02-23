import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserWorkspaces } from "@/lib/workspace";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a workspace
  const workspaces = await getUserWorkspaces(userId);
  if (workspaces.length > 0) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Smart-Link Hub!</h1>
          <p className="mt-2 text-gray-600">
            Let's create your workspace to get started
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
