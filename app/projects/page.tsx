import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/lib/constants';
import GradualBlur from '@/components/GradualBlur';

function Page() {
  return (
    <>
      <div className="grid justify-items-center mt-[1em] pb-0">
        <div className="w-full max-w-[560px] h-[60vh] overflow-y-auto overscroll-contain no-scrollbar">
          <div className="grid gap-8 pr-2 py-4">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.github_url} project={project} />
            ))}
            <div aria-hidden className="h-[220px]" />
          </div>
        </div>
      </div>
      <div className="relative w-full h-[1em] mt-4">
        <GradualBlur target="page" position="bottom" animated={true} height="5em" strength={1} divCount={3} curve="bezier" opacity={0.8} />
      </div>
    </>
  );
}

export default Page;
