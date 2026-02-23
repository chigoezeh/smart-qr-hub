import AdvancedQRForm from "@/components/AdvancedQRForm";
import { getCurrentWorkspace } from "@/lib/workspace";
import { redirect } from "next/navigation";

export default async function CreateQRPage() {
  const workspace = await getCurrentWorkspace();
  
  if (!workspace) {
    redirect("/onboarding");
  }

  return <AdvancedQRForm />;
}
