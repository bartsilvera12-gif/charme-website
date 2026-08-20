import { getActiveCourseSlugs } from "@/lib/data/courses";
import CourseCampus from "@/components/campus/CourseCampus";

export async function generateStaticParams() {
  const slugs = await getActiveCourseSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export const metadata = { title: "Curso — Academia CHARME" };

export default async function CursoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseCampus slug={slug} />;
}
