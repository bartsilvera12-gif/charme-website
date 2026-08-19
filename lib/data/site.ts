import { createPublicClient } from "@/lib/supabase/public";

export type TestimonialView = {
  name: string;
  username: string | null;
  body: string;
  img: string | null;
  country: string | null;
};

export type FaqView = { question: string; answer: string };

export type GalleryView = { type: "image" | "video"; src: string; alt: string };

export type ProfessionalView = {
  name: string;
  roleTitle: string | null;
  eyebrow: string | null;
  shortDescription: string | null;
  biography: string | null;
  image: string | null;
};

export type AboutView = {
  title: string | null;
  mainDescription: string | null;
  image: string | null;
  vision: string | null;
  mission: string | null;
  quote: string | null;
  quoteAuthor: string | null;
  values: string[];
};

export type ContactView = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
  mapsUrl: string | null;
  mapEmbedUrl: string | null;
};

export async function getTestimonials(limit = 12): Promise<TestimonialView[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("name, username, body, avatar_url, country, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((t) => ({
    name: t.name, username: t.username, body: t.body, img: t.avatar_url, country: t.country,
  }));
}

export async function getFaqs(): Promise<FaqView[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("question, answer, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getGalleryItems(limit?: number, type?: "image" | "video"): Promise<GalleryView[]> {
  const supabase = createPublicClient();
  let q = supabase
    .from("gallery_items")
    .select("type, media_url, alt_text, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (type) q = q.eq("type", type);
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((g) => ({
    type: g.type as "image" | "video",
    src: g.media_url,
    alt: g.alt_text ?? "",
  }));
}

export async function getGalleryCount(): Promise<number> {
  const supabase = createPublicClient();
  const { count, error } = await supabase
    .from("gallery_items")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  if (error) throw error;
  return count ?? 0;
}

export type HomeSection = {
  eyebrow: string | null; title: string | null; subtitle: string | null; body: string | null;
  cta_label: string | null; cta_url: string | null; image_url: string | null;
  extra: Record<string, any>;
};

export async function getHomeContent(): Promise<Record<string, HomeSection>> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("home_content")
    .select("section, eyebrow, title, subtitle, body, cta_label, cta_url, image_url, extra")
    .eq("is_active", true);
  if (error) throw error;
  const map: Record<string, HomeSection> = {};
  for (const r of data ?? []) {
    map[r.section] = {
      eyebrow: r.eyebrow, title: r.title, subtitle: r.subtitle, body: r.body,
      cta_label: r.cta_label, cta_url: r.cta_url, image_url: r.image_url, extra: r.extra ?? {},
    };
  }
  return map;
}

export async function getFeaturedProfessional(): Promise<ProfessionalView | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("professionals")
    .select("name, role_title, eyebrow, short_description, biography, image_url, is_featured, sort_order")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    name: data.name, roleTitle: data.role_title, eyebrow: data.eyebrow,
    shortDescription: data.short_description, biography: data.biography, image: data.image_url,
  };
}

export async function getAboutContent(): Promise<AboutView | null> {
  const supabase = createPublicClient();
  const [{ data: about, error: e1 }, { data: values, error: e2 }] = await Promise.all([
    supabase.from("about_content").select("*").limit(1).maybeSingle(),
    supabase.from("about_values").select("label, sort_order").eq("is_active", true).order("sort_order", { ascending: true }),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  if (!about) return null;
  return {
    title: about.title, mainDescription: about.main_description, image: about.image_url,
    vision: about.vision, mission: about.mission, quote: about.quote, quoteAuthor: about.quote_author,
    values: (values ?? []).map((v) => v.label),
  };
}

export async function getContactSettings(): Promise<ContactView | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("contact_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    phone: data.phone, whatsapp: data.whatsapp, email: data.email, address: data.address,
    hours: data.hours, mapsUrl: data.maps_url, mapEmbedUrl: data.map_embed_url,
  };
}
