import MatterCanvas from "../components/ui/PillsCanvas";

const Skills = () => {
  return (
    <section id="skills" className="relative min-h-[50vh] w-full flex flex-col items-end">
      <div className="absolute inset-0 top-0 h-full w-full z-[0]">
        <MatterCanvas />
      </div>
      <div className="absolute inset-0 top-0 w-full h-56 z-[1] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-transparent dark:to-foreground to-background" />
      </div>
    </section>
  );
};

export default Skills;
