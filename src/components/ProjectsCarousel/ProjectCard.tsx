import type { Project } from "../../constants/PROJECTS";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <a
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden bg-foreground/5 dark:bg-background/5 border border-foreground/10 dark:border-background/10 transition-all duration-500 hover:shadow-lg hover:border-accent/40"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground dark:text-background leading-tight">
            {project.title}
          </h3>
          <span className="text-xs font-robo text-foreground/50 dark:text-background/50">
            {project.year}
          </span>
        </div>

        <p className="text-sm font-robo text-accent font-medium">
          {project.type}
        </p>

        {project.description && (
          <p className="text-xs font-robo text-foreground/60 dark:text-background/60 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[0.65rem] font-robo px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
};

export default ProjectCard;
