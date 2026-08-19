"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slug";
import ImageUpload from "./ImageUpload";

type Category = { id: string; name: string };
type Module = { title: string; detail: string };

type CourseState = {
  slug: string; name: string; price: string; image_url: string | null;
  category_id: string | null; duration: string; mode: string; level: string;
  certificate: string; intro: string; overview: string; pagopar_url: string;
  alt_enroll_url: string; seo_title: string; seo_description: string;
  is_active: boolean; is_featured: boolean; sort_order: number;
};

const empty: CourseState = {
  slug: "", name: "", price: "", image_url: null, category_id: null, duration: "", mode: "",
  level: "", certificate: "", intro: "", overview: "", pagopar_url: "", alt_enroll_url: "",
  seo_title: "", seo_description: "", is_active: true, is_featured: false, sort_order: 0,
};

export default function CourseForm({ courseId }: { courseId?: string }) {
  const supabase = createClient();
  const router = useRouter();
  const isEdit = !!courseId;

  const [course, setCourse] = useState<CourseState>(empty);
  const [learn, setLearn] = useState<string[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CourseState>(k: K, v: CourseState[K]) => setCourse((c) => ({ ...c, [k]: v }));

  const load = useCallback(async () => {
    const { data: cats } = await supabase.from("course_categories").select("id, name").order("sort_order");
    setCategories((cats as Category[]) ?? []);
    if (!courseId) return;
    const { data, error } = await supabase
      .from("courses")
      .select("*, learn:course_learning_items(content,sort_order), modules:course_modules(title,detail,sort_order), requirements:course_requirements(content,sort_order)")
      .eq("id", courseId)
      .maybeSingle();
    if (error || !data) { setError("No se pudo cargar la formación."); setLoading(false); return; }
    const { learn: l, modules: m, requirements: r, ...rest } = data as any;
    setCourse({ ...empty, ...rest, category_id: rest.category_id ?? null });
    setLearn((l ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => x.content));
    setModules((m ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => ({ title: x.title, detail: x.detail ?? "" })));
    setRequirements((r ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => x.content));
    setLoading(false);
  }, [supabase, courseId]);

  useEffect(() => { load(); }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!course.name.trim()) { setError("El nombre es obligatorio."); return; }
    const slug = (course.slug.trim() || slugify(course.name)).trim();
    setSaving(true);

    const payload = {
      slug, name: course.name.trim(), price: course.price || null, image_url: course.image_url,
      category_id: course.category_id || null, duration: course.duration || null, mode: course.mode || null,
      level: course.level || null, certificate: course.certificate || null, intro: course.intro || null,
      overview: course.overview || null, pagopar_url: course.pagopar_url || null,
      alt_enroll_url: course.alt_enroll_url || null, seo_title: course.seo_title || null,
      seo_description: course.seo_description || null, is_active: course.is_active,
      is_featured: course.is_featured, sort_order: course.sort_order,
    };

    let id = courseId;
    if (isEdit) {
      const { error } = await supabase.from("courses").update(payload).eq("id", courseId!);
      if (error) return fail(error);
    } else {
      const { data, error } = await supabase.from("courses").insert(payload).select("id").single();
      if (error) return fail(error);
      id = data.id;
    }

    // Reemplazar listas hijas (borrar + insertar)
    await Promise.all([
      supabase.from("course_learning_items").delete().eq("course_id", id!),
      supabase.from("course_modules").delete().eq("course_id", id!),
      supabase.from("course_requirements").delete().eq("course_id", id!),
    ]);
    const inserts: Promise<any>[] = [];
    const cleanLearn = learn.map((s) => s.trim()).filter(Boolean);
    const cleanReq = requirements.map((s) => s.trim()).filter(Boolean);
    const cleanMods = modules.filter((m) => m.title.trim());
    if (cleanLearn.length) inserts.push(supabase.from("course_learning_items").insert(cleanLearn.map((content, i) => ({ course_id: id, content, sort_order: i }))) as any);
    if (cleanReq.length) inserts.push(supabase.from("course_requirements").insert(cleanReq.map((content, i) => ({ course_id: id, content, sort_order: i }))) as any);
    if (cleanMods.length) inserts.push(supabase.from("course_modules").insert(cleanMods.map((m, i) => ({ course_id: id, title: m.title.trim(), detail: m.detail.trim() || null, sort_order: i }))) as any);
    const results = await Promise.all(inserts);
    const childErr = results.find((r) => r.error);
    if (childErr) return fail(childErr.error);

    setSaving(false);
    router.push("/admin/formaciones");
    router.refresh();

    function fail(err: any) {
      setError(err.message?.includes("duplicate") ? "Ya existe una formación con ese slug." : err.message);
      setSaving(false);
    }
  }

  if (loading) return <div className="adm-content"><div className="adm-empty">Cargando…</div></div>;

  return (
    <form onSubmit={onSubmit}>
      <header className="adm-topbar">
        <h1>{isEdit ? "Editar formación" : "Nueva formación"}</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push("/admin/formaciones")}>Cancelar</button>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </header>
      <div className="adm-content">
        {error && <div className="adm-alert adm-alert-error">{error}</div>}

        <div className="adm-card">
          <h2>Datos generales</h2>
          <ImageUpload value={course.image_url} onChange={(url) => set("image_url", url)} folder="courses" label="Imagen de portada" />
          <Field label="Nombre"><input className="adm-input" value={course.name} onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} /></Field>
          <Field label="Slug (URL)"><input className="adm-input" value={course.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} placeholder="colorimetria-inicial" /></Field>
          <div className="adm-grid2">
            <Field label="Categoría">
              <select className="adm-select" value={course.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)}>
                <option value="">— Sin categoría —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Precio"><input className="adm-input" value={course.price} onChange={(e) => set("price", e.target.value)} placeholder="Gs. 250.000" /></Field>
            <Field label="Duración"><input className="adm-input" value={course.duration} onChange={(e) => set("duration", e.target.value)} placeholder="4 semanas" /></Field>
            <Field label="Modalidad"><input className="adm-input" value={course.mode} onChange={(e) => set("mode", e.target.value)} placeholder="100% online" /></Field>
            <Field label="Nivel"><input className="adm-input" value={course.level} onChange={(e) => set("level", e.target.value)} placeholder="Inicial" /></Field>
            <Field label="Certificación"><input className="adm-input" value={course.certificate} onChange={(e) => set("certificate", e.target.value)} placeholder="Certificado digital" /></Field>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <label className="adm-checkbox"><input type="checkbox" checked={course.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Activa (visible)</label>
          </div>
        </div>

        <div className="adm-card">
          <h2>Textos</h2>
          <Field label="Introducción (frase corta)"><input className="adm-input" value={course.intro} onChange={(e) => set("intro", e.target.value)} /></Field>
          <Field label="Descripción completa"><textarea className="adm-textarea" value={course.overview} onChange={(e) => set("overview", e.target.value)} /></Field>
        </div>

        <div className="adm-card">
          <h2>Lo que vas a aprender</h2>
          <ListEditor items={learn} setItems={setLearn} placeholder="Ej: Fundamentos de teoría del color" />
        </div>

        <div className="adm-card">
          <h2>Programa (módulos)</h2>
          <ModuleEditor items={modules} setItems={setModules} />
        </div>

        <div className="adm-card">
          <h2>Requisitos</h2>
          <ListEditor items={requirements} setItems={setRequirements} placeholder="Ej: Acceso a internet" />
        </div>

        <div className="adm-card">
          <h2>Inscripción y SEO</h2>
          <Field label="URL de Pagopar"><input className="adm-input" value={course.pagopar_url} onChange={(e) => set("pagopar_url", e.target.value)} placeholder="https://..." /></Field>
          <Field label="URL alternativa de inscripción"><input className="adm-input" value={course.alt_enroll_url} onChange={(e) => set("alt_enroll_url", e.target.value)} placeholder="https://..." /></Field>
          <Field label="SEO título"><input className="adm-input" value={course.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></Field>
          <Field label="SEO descripción"><textarea className="adm-textarea" value={course.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></Field>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>{saving ? "Guardando…" : "Guardar formación"}</button>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push("/admin/formaciones")}>Cancelar</button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="adm-field"><label className="adm-label">{label}</label>{children}</div>;
}

function ListEditor({ items, setItems, placeholder }: { items: string[]; setItems: (v: string[]) => void; placeholder?: string }) {
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const copy = [...items]; [copy[i], copy[j]] = [copy[j], copy[i]]; setItems(copy);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <input className="adm-input" value={it} placeholder={placeholder} onChange={(e) => { const c = [...items]; c[i] = e.target.value; setItems(c); }} />
          <button type="button" className="adm-btn adm-btn-ghost" style={{ minHeight: 44, padding: "0 10px" }} onClick={() => move(i, -1)}>↑</button>
          <button type="button" className="adm-btn adm-btn-ghost" style={{ minHeight: 44, padding: "0 10px" }} onClick={() => move(i, 1)}>↓</button>
          <button type="button" className="adm-btn adm-btn-danger" style={{ minHeight: 44, padding: "0 12px" }} onClick={() => setItems(items.filter((_, k) => k !== i))}>✕</button>
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setItems([...items, ""])}>+ Agregar</button>
    </div>
  );
}

function ModuleEditor({ items, setItems }: { items: Module[]; setItems: (v: Module[]) => void }) {
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const copy = [...items]; [copy[i], copy[j]] = [copy[j], copy[i]]; setItems(copy);
  };
  const upd = (i: number, patch: Partial<Module>) => { const c = [...items]; c[i] = { ...c[i], ...patch }; setItems(c); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((m, i) => (
        <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 10, padding: 14 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input className="adm-input" value={m.title} placeholder="Título del módulo" onChange={(e) => upd(i, { title: e.target.value })} />
            <button type="button" className="adm-btn adm-btn-ghost" style={{ minHeight: 44, padding: "0 10px" }} onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="adm-btn adm-btn-ghost" style={{ minHeight: 44, padding: "0 10px" }} onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="adm-btn adm-btn-danger" style={{ minHeight: 44, padding: "0 12px" }} onClick={() => setItems(items.filter((_, k) => k !== i))}>✕</button>
          </div>
          <textarea className="adm-textarea" style={{ minHeight: 70 }} value={m.detail} placeholder="Descripción del módulo" onChange={(e) => upd(i, { detail: e.target.value })} />
        </div>
      ))}
      <button type="button" className="adm-btn adm-btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setItems([...items, { title: "", detail: "" }])}>+ Agregar módulo</button>
    </div>
  );
}
