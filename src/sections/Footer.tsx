"use client";
import { cn } from "../utils";
import AnimatedTooltip from "../components/AnimatedTooltip";
import { Link } from "react-router-dom";
import socialPlatforms from "../constants/SOCIALS";
import LogoShort from "../components/ui/LogoShort";

export const Footer = () => {
  return (
    <footer className="relative w-full flex flex-col items-center pt-12">
      <div className="relative w-full text-center flex flex-col items-center">
        {/* Large background text - FIXED */}
        <div
          className="bg-gradient-to-b from-accent via-accent to-background dark:to-foreground bg-clip-text text-transparent leading-none font-extrabold tracking-widest pointer-events-none select-none font-grandbold"
          style={{
            fontSize: "clamp(7rem, 25vw, 30rem)",
            maxWidth: "95vw",
            lineHeight: "0.75",
          }}
        >
          REMI
        </div>

        {/* Bottom logo */}
        <div className="absolute squircle hover:border-background/20 duration-400 drop-shadow-[0_0px_30px_rgba(28,34,47,0.5)] dark:drop-shadow-[0_0px_20px_rgba(255,255,255,0.3)] backdrop-blur-lg rounded-4xl bg-white/10 dark:bg-foreground/10 left-1/2 border-2 border-white/40 dark:border-background/10 flex items-center justify-center p-3 -translate-x-1/2 z-10 -bottom-14">
          <div className="size-12 sm:size-16 md:size-24 bg-gradient-to-br from-white dark:from-foreground to-white/80 dark:to-foreground/80 flex items-center justify-center shadow-lg squircle rounded-4xl">
            <LogoShort className="size-8 text-accent" />
          </div>
        </div>

        {/* Bottom shadow */}
        <div className="bg-gradient-to-t from-background via-background to-background/30 dark:from-foreground dark:via-foreground dark:to-foreground/30 absolute -bottom-16 blur-3xl w-full h-16 lg:h-36" />
        {/* Bottom line */}
        <div className="absolute bottom-0 backdrop-blur-sm h-1 bg-gradient-to-r from-transparent via-foreground/5 dark:via-background/5 to-transparent w-full left-1/2 -translate-x-1/2" />
      </div>
      <div className="pt-28 pb-16 social_icons flex flex-col items-center lg:gap-6 relative">
        <h4
          className={cn(
            "footer-links-heading select-none",
            "font-mono tracking-widest",
            "text-foreground/50 dark:text-background/40",
            "sm:text-base text-xs",
            "will-change-[opacity,transform]"
          )}
        >
          SOCIALS
        </h4>
        <div className="flex space-x-4">
          {socialPlatforms.map((platform, index) => (
            <Link
              to={platform.href}
              key={platform.social}
              target="_blank"
              rel="noopener noreferrer"
              className="size-16 relative rounded-2xl"
            >
              <AnimatedTooltip
                id={index + 1}
                className={cn(
                  "size-14 lg:size-16 p-3 lg:p-4 mask squircle rounded-5xl cursor-pointer",
                  "bg-foreground/15 hover:bg-foreground/20",
                  "text-foreground md:text-foreground/85 hover:text-foreground",

                  "dark:bg-background/10 dark:hover:bg-background/20",
                  "dark:text-background dark:hover:text-white",
                  "transition-colors duration-300"
                )}
                mains={platform.social}
                Children={<platform.icon className="size-full" fill />}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center w-full px-6 py-10 border-t border-foreground/10 dark:border-background/5 text-foreground/50 dark:text-background/30 gap-6 group font-robo">
        <p className="space-x-2">
          <a
            href="/"
            className="group-hover:text-foreground dark:group-hover:text-background transition-colors duration-500"
          >
            Remi
          </a>{" "}
          &#169; <span className="font-mono">2025</span>
        </p>{" "}
        • <span>All Rights Reserved</span>
      </div>
    </footer>
  );
};
