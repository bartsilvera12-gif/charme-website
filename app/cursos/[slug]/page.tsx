import { getActiveCourseSlugs, getCourseBySlug } from "@/lib/data/courses";
import CourseDetail from "@/components/public/CourseDetail";

export async function generateStaticParams() {
  const slugs = await getActiveCourseSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug).catch(() => null);
  if (!course) return { title: "Formación — Academia CHARME" };
  return {
    title: course.seoTitle || `${course.name} — Academia CHARME`,
    description: course.seoDescription || course.intro || undefined,
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
