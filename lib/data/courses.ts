import { createPublicClient } from "@/lib/supabase/public";

export type CourseListItem = {
  slug: string;
  name: string;
  price: string | null;
  image: string | null;
};

export type CourseDetail = CourseListItem & {
  category: string | null;
  categorySlug: string | null;
  duration: string | null;
  mode: string | null;
  level: string | null;
  certificate: string | null;
  intro: string | null;
  overview: string | null;
  learn: string[];
  modules: { title: string; detail: string | null }[];
  requirements: string[];
  pagoparUrl: string | null;
  altEnrollUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

const bySort = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

const COURSE_SELECT = `
  slug, name, price, image_url, duration, mode, level, certificate, intro, overview,
  pagopar_url, alt_enroll_url, seo_title, seo_description, is_active, sort_order,
  category:course_categories ( name, slug ),
  learn:course_learning_items ( content, sort_order ),
  modules:course_modules ( title, detail, sort_order ),
  requirements:course_requirements ( content, sort_order )
`;

/* Mapea una fila de Supabase a la forma que consumen los componentes */
function mapCourse(row: any): CourseDetail {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    slug: row.slug,
    name: row.name,
    price: row.price,
    image: row.image_url,
    category: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    duration: row.duration,
    mode: row.mode,
    level: row.level,
    certificate: row.certificate,
    intro: row.intro,
    overview: row.overview,
    learn: (row.learn ?? []).sort(bySort).map((l: any) => l.content),
    modules: (row.modules ?? []).sort(bySort).map((m: any) => ({ title: m.title, detail: m.detail })),
    requirements: (row.requirements ?? []).sort(bySort).map((r: any) => r.content),
    pagoparUrl: row.pagopar_url,
    altEnrollUrl: row.alt_enroll_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

/** Lista de formaciones activas (para la home y grillas). */
export async function getActiveCourses(): Promise<CourseListItem[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("courses")
    .select("slug, name, price, image_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({ slug: c.slug, name: c.name, price: c.price, image: c.image_url }));
}

/** Slugs de formaciones activas (para generateStaticParams). */
export async function getActiveCourseSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("courses").select("slug").eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((c) => c.slug);
}

/** Formación completa por slug (sólo si está activa). null si no existe. */
export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCourse(data) : null;
}

/** Formaciones relacionadas por categoría (activas, excluyendo la actual). */
export async function getRelatedCourses(
  categorySlug: string | null,
  excludeSlug: string,
  limit = 3,
): Promise<CourseListItem[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("courses")
    .select("slug, name, price, image_url, sort_order, category:course_categories!inner ( slug )")
    .eq("is_active", true)
    .neq("slug", excludeSlug)
    .order("sort_order", { ascending: true })
    .limit(limit);
  if (categorySlug) query = query.eq("course_categories.slug", categorySlug);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((c) => ({ slug: c.slug, name: c.name, price: c.price, image: c.image_url }));
}
