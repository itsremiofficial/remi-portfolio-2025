import { forwardRef } from "react";
import { type Project } from "../../constants/PROJECTS";

interface ProjectInfoPanelProps {
  hoveredProject: Project | null;
  isActive: boolean;
  panelSide: "left" | "right";
}

const ProjectInfoPanel = forwardRef<HTMLDivElement, ProjectInfoPanelProps>(
  ({ hoveredProject, isActive, panelSide }, ref) => {
    return (
      <div
        ref={ref}
        className="fixed pointer-events-none z-20 will-change-transform"
        style={{
          left: 0,
          top: 0,
        }}
      >
        <div
          className={`transition-all duration-300 ease-out ${
            isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{
            // CONFIG: Panel offset distance from cursor (20px)
            transform:
              panelSide === "right"
                ? "translate(75px, -50%)" // Position to the right
                : "translate(-100%, -50%) translate(-75px, 0)", // Position to the left
          }}
        >
          {hoveredProject && (
            <div
              className={`bg-black/90 backdrop-blur-md text-white p-6 squircle rounded-3xl shadow-2xl border border-white/10 min-w-[300px] max-w-[400px] ${
                panelSide === "left" ? "origin-right" : "origin-left"
              }`}
            >
              {/* Project Title */}
              <h3 className="text-2xl font-bold mb-2 text-white">
                {hoveredProject.title}
              </h3>

              {/* Category */}
              <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">
                {hoveredProject.type}
              </p>

              {/* Tech Stack */}
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {hoveredProject.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90 border border-white/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Click hint */}
              <p className="text-xs text-gray-500 mt-4 text-center italic">
                Click card to view details
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ProjectInfoPanel.displayName = "ProjectInfoPanel";

export default ProjectInfoPanel;
