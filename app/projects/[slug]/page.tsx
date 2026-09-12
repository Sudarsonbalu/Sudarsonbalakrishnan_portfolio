import { notFound } from 'next/navigation'
import { portfolioData } from '../../../data/portfolio-data'
import ProjectDetailView from '../../../components/project-detail-view'

export function generateStaticParams() {
  return portfolioData.projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const projectIndex = portfolioData.projects.findIndex((p) => p.slug === slug)

  if (projectIndex === -1) {
    notFound()
  }

  const project = portfolioData.projects[projectIndex]
  const nextProject = portfolioData.projects[(projectIndex + 1) % portfolioData.projects.length]

  return <ProjectDetailView project={project} nextProject={nextProject} />
}
