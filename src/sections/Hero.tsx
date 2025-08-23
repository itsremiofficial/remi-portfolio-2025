import ModernArrow from "../components/ModernArrow";

const Hero = () => {
  return (
    <section
      className="w-full min-h-[calc(100vh-6rem)] flex items-center justify-center"
      id="home"
    >
      <div className="text-center space-y-3">
        <h1 className="hero-heading font-nippo flex items-center justify-center gap-12 font-medium">
          Designer <ModernArrow className="w-14 h-max" /> Developer
        </h1>
        <p className="mt-4 text-[10vw] text-wrap">
          I Turn Imagination <br /> Into Interactive Digital <br /> Experiences
        </p>
      </div>
    </section>
  );
};

export default Hero;
