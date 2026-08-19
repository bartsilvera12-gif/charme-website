"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseForm from "@/components/admin/CourseForm";

function EditarInner() {
  const params = useSearchParams();
  const id = params.get("id") ?? undefined;
  return <CourseForm courseId={id} />;
}

export default function EditarFormacionPage() {
  return (
    <Suspense fallback={<div className="adm-content"><div className="adm-empty">Cargando…</div></div>}>
      <EditarInner />
    </Suspense>
  );
}
