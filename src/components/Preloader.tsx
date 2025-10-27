import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Refs for elements
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const line0to25Ref = useRef<HTMLDivElement>(null);
  const line25to50Ref = useRef<HTMLDivElement>(null);
  const line50to75Ref = useRef<HTMLDivElement>(null);
  const line75to100Ref = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const block4Ref = useRef<HTMLDivElement>(null);

  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    "INITIALIZING",
    "DATA_TRANSFER",
    "COMPILING",
    "FINALIZING",
    "COMPLETE",
  ];

  // Complete loading animation
  const completeLoading = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.to(preloaderRef.current, {
      y: "-100%",
      duration: 1,
      ease: "power2.inOut",
    }).set(preloaderRef.current, {
      display: "none",
    });
  }, [onComplete]);

  // Track loading progress
  useEffect(() => {
    let loadedResources = 0;
    let totalResources = 0;

    // Track fonts
    const fontPromises: Promise<void>[] = [];
    if ("fonts" in document) {
      document.fonts.forEach(() => {
        totalResources++;
      });

      const fontPromise = document.fonts.ready.then(() => {
        loadedResources += document.fonts.size;
        updateProgress();
      });
      fontPromises.push(fontPromise);
    } else {
      // Fallback: assume fonts loaded after delay
      totalResources += 5;
      setTimeout(() => {
        loadedResources += 5;
        updateProgress();
      }, 500);
    }

    // Track images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      totalResources++;
      if (img.complete) {
        loadedResources++;
      } else {
        img.addEventListener("load", () => {
          loadedResources++;
          updateProgress();
        });
        img.addEventListener("error", () => {
          loadedResources++;
          updateProgress();
        });
      }
    });

    // Track background images
    const elementsWithBg = document.querySelectorAll(
      "[style*='background-image']"
    );
    elementsWithBg.forEach((el) => {
      totalResources++;
      const bgImage = window.getComputedStyle(el).backgroundImage;
      const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match) {
        const img = new Image();
        img.onload = () => {
          loadedResources++;
          updateProgress();
        };
        img.onerror = () => {
          loadedResources++;
          updateProgress();
        };
        img.src = match[1];
      } else {
        loadedResources++;
      }
    });

    // Minimum resources for progress calculation
    if (totalResources === 0) {
      totalResources = 10;
      // Simulate loading over time
      const interval = setInterval(() => {
        loadedResources++;
        updateProgress();
        if (loadedResources >= totalResources) {
          clearInterval(interval);
        }
      }, 200);
    }

    function updateProgress() {
      const calculatedProgress = Math.min(
        100,
        Math.floor((loadedResources / totalResources) * 100)
      );
      setProgress(calculatedProgress);
    }

    // Initial update
    updateProgress();
  }, []);

  // Update counter with animation
  useEffect(() => {
    const animateCounter = () => {
      if (currentCount < progress) {
        const step = progress - currentCount > 10 ? 2 : 1;
        setTimeout(() => {
          setCurrentCount((prev) => Math.min(progress, prev + step));
        }, 40);
      }
    };
    animateCounter();
  }, [progress, currentCount]);

  // Update system messages
  useEffect(() => {
    const messageIndex = Math.min(4, Math.floor(progress / 20));
    setCurrentMessage(messageIndex);
  }, [progress]);

  // Update visual elements based on progress
  useEffect(() => {
    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }

    // Update grid lines
    if (topRowRef.current) topRowRef.current.style.width = `${progress}%`;
    if (bottomRowRef.current) bottomRowRef.current.style.width = `${progress}%`;
    if (leftColumnRef.current)
      leftColumnRef.current.style.height = `${progress}%`;
    if (rightColumnRef.current)
      rightColumnRef.current.style.height = `${progress}%`;

    // Update connector lines
    if (line0to25Ref.current) {
      const scale0to25 = Math.min(1, Math.max(0, progress - 0) / 25);
      line0to25Ref.current.style.transform = `scaleX(${scale0to25})`;
    }
    if (line25to50Ref.current) {
      const scale25to50 = Math.min(1, Math.max(0, progress - 25) / 25);
      line25to50Ref.current.style.transform = `scaleX(${scale25to50})`;
    }
    if (line50to75Ref.current) {
      const scale50to75 = Math.min(1, Math.max(0, progress - 50) / 25);
      line50to75Ref.current.style.transform = `scaleX(${scale50to75})`;
    }
    if (line75to100Ref.current) {
      const scale75to100 = Math.min(1, Math.max(0, progress - 75) / 25);
      line75to100Ref.current.style.transform = `scaleX(${scale75to100})`;
    }

    // Update blocks
    if (block1Ref.current && progress >= 20) {
      const scale = Math.min(1, (progress - 20) / 20);
      block1Ref.current.style.transform = `scale(${scale})`;
    }
    if (block2Ref.current && progress >= 40) {
      const scale = Math.min(1, (progress - 40) / 20);
      block2Ref.current.style.transform = `scale(${scale})`;
    }
    if (block3Ref.current && progress >= 60) {
      const scale = Math.min(1, (progress - 60) / 20);
      block3Ref.current.style.transform = `scale(${scale})`;
    }
    if (block4Ref.current && progress >= 80) {
      const scale = Math.min(1, (progress - 80) / 20);
      block4Ref.current.style.transform = `scale(${scale})`;
    }

    // Complete loading
    if (progress >= 100 && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        completeLoading();
      }, 800);
    }
  }, [progress, isComplete, completeLoading]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-[1000] flex flex-col overflow-hidden bg-background dark:bg-foreground"
      ref={preloaderRef}
    >
      {/* Pixel grid elements */}
      <div className="pixel-grid">
        <div className="pixel-row" id="top-row" ref={topRowRef} />
        <div className="pixel-row" id="bottom-row" ref={bottomRowRef} />
        <div className="pixel-column" id="left-column" ref={leftColumnRef} />
        <div className="pixel-column" id="right-column" ref={rightColumnRef} />
      </div>

      {/* Massive counter */}
      <div className="counter-wrapper">
        <div className="counter" ref={counterRef}>
          {currentCount}
        </div>
        <div className="counter-outline" aria-hidden="true">
          {currentCount}
        </div>
      </div>

      {/* Status text */}
      <div className="text-container">
        <div className="loading-text">LOADING SYSTEM</div>
        <div className="system-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${index === currentMessage ? "active" : ""}`}
            >
              {message}
            </div>
          ))}
        </div>
      </div>

      {/* Progress markers */}
      <div className="loading-bar-container">
        <div className="loading-bar">
          <div className="progress" ref={progressBarRef} />
        </div>
        <div className="loading-bar-markers">
          <div className="marker" data-position="0">
            00
          </div>
          <div className="marker" data-position="25">
            25
          </div>
          <div className="marker" data-position="50">
            50
          </div>
          <div className="marker" data-position="75">
            75
          </div>
          <div className="marker" data-position="100">
            100
          </div>
        </div>
        {/* Progressive line fills */}
        <div className="connector-lines">
          <div
            className="connector-line"
            id="line-0-25"
            ref={line0to25Ref}
          ></div>
          <div
            className="connector-line"
            id="line-25-50"
            ref={line25to50Ref}
          ></div>
          <div
            className="connector-line"
            id="line-50-75"
            ref={line50to75Ref}
          ></div>
          <div
            className="connector-line"
            id="line-75-100"
            ref={line75to100Ref}
          ></div>
        </div>
      </div>

      {/* Block elements that progressively fill */}
      <div className="block-container">
        <div className="block" id="block-1" ref={block1Ref}></div>
        <div className="block" id="block-2" ref={block2Ref}></div>
        <div className="block" id="block-3" ref={block3Ref}></div>
        <div className="block" id="block-4" ref={block4Ref}></div>
      </div>
    </div>
  );
};

export default Preloader;
