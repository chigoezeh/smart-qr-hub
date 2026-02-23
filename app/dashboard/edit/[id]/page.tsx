import { getQRCodeForEdit } from "@/actions/qr-update";
import { redirect } from "next/navigation";
import AdvancedQRForm from "@/components/AdvancedQRForm";

export default async function EditQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const qrId = parseInt(id, 10);

  if (isNaN(qrId)) {
    redirect("/dashboard/qr-codes");
  }

  const result = await getQRCodeForEdit(qrId);

  if (!result.success || !result.data) {
    redirect("/dashboard/qr-codes");
  }

  return <AdvancedQRForm editMode={true} existingData={result.data} />;
}
