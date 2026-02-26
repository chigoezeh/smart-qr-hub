import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workspaceMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import OnboardingWizard from "@/components/OnboardingWizard";

export default async function LandingPageOnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Check if user has workspace
  const membership = await db.query.workspaceMembers.findFirst({
    where: eq(workspaceMembers.userId, user.id),
  });

  if (!membership) redirect("/onboarding");

  return <OnboardingWizard />;
}
