import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectView } from '@/components/project/ProjectView';
import { getNextProject, getProject, projects } from '@/data/projects';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.headline,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.headline,
      description: project.summary,
      images: [{ url: project.cover, alt: project.headline }],
    },
    twitter: { card: 'summary_large_image', title: project.headline, images: [project.cover] },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <ProjectView
      project={project}
      next={getNextProject(project.slug)}
      position={projects.findIndex((p) => p.slug === project.slug) + 1}
      total={projects.length}
    />
  );
}
