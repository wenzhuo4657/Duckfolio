import { Projects } from '@/components/features/projects';
import { getConfig } from '@/lib/config';

export default function ProjectsPage() {
  const config = getConfig();

  return <Projects projectSections={config.projectSections || []} />;
}
