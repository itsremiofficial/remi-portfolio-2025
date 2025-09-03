import React, { useEffect } from "react";

// UPDATED: include base arrow mapping (previously only CSS handled this)
const CURSOR_MAP: Record<string, string> = {
  auto: 'url("/cursors/default.svg") 0 0, default',
  default: 'url("/cursors/default.svg") 0 0, default',
  pointer: 'url("/cursors/handpointing.svg") 4 2, pointer',
  text: 'url("/cursors/textcursor.svg") 12 16, text',
  "text-input": 'url("/cursors/textcursor.svg") 12 16, text',
  move: 'url("/cursors/move.svg") 12 12, move',
  grab: 'url("/cursors/handopen.svg") 12 12, grab',
  grabbing: 'url("/cursors/handgrabbing.svg") 12 12, grabbing',
  "not-allowed": 'url("/cursors/notallowed.svg") 12 12, not-allowed',
  "ew-resize": 'url("/cursors/mac-ew-resize.png") 16 16, ew-resize',
  "ns-resize": 'url("/cursors/mac-ns-resize.png") 16 16, ns-resize',
  "nesw-resize": 'url("/cursors/mac-nesw-resize.png") 16 16, nesw-resize',
  "nwse-resize": 'url("/cursors/mac-nwse-resize.png") 16 16, nwse-resize',
};

// Allow list only for values we still ignore
const IGNORED_VALUES = new Set(["inherit", "initial", "unset"]);

const isCustomAlready = (val: string) => /url\(/i.test(val);

interface MacCursorAutoProps {
  // If false, will not override the base auto/default cursors
  allowBaseCursorOverride?: boolean;
  // Limit max elements per scan to avoid huge DOM cost (0 = unlimited)
  scanLimit?: number;
}

const MacCursorAuto: React.FC<MacCursorAutoProps> = ({
  allowBaseCursorOverride = true,
  scanLimit = 0,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    let scheduled = false;

    const applyForElement = (el: Element) => {
      if (!(el instanceof HTMLElement)) return;
      if (el.dataset.macCursorIgnore === "true") return;

      const computed = getComputedStyle(el).cursor.trim();
      if (!computed) return;
      if (IGNORED_VALUES.has(computed)) return;
      if (isCustomAlready(computed)) return;

      // If base override disabled and cursor is auto/default, skip
      if (
        !allowBaseCursorOverride &&
        (computed === "auto" || computed === "default")
      )
        return;

      const mapped = CURSOR_MAP[computed];
      if (mapped && el.style.cursor !== mapped) {
        el.style.cursor = mapped;
      }
    };

    const scanAll = (rootNode: ParentNode) => {
      const all = (rootNode as HTMLElement).querySelectorAll<HTMLElement>("*");
      let count = 0;
      all.forEach((el) => {
        if (scanLimit && count >= scanLimit) return;
        applyForElement(el);
        count++;
      });
      // Also apply to root/body for base cursor
      applyForElement(document.documentElement);
      applyForElement(document.body);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scanAll(root);
      });
    };

    // Initial pass
    schedule();

    const observer = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          (m.attributeName === "class" || m.attributeName === "style")
        ) {
          applyForElement(m.target as HTMLElement);
        } else {
          needsScan = true;
        }
      }
      if (needsScan) schedule();
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-mac-cursor-ignore"],
    });

    const resizeHandler = () => schedule();
    window.addEventListener("resize", resizeHandler);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [allowBaseCursorOverride, scanLimit]);

  return null;
};

export default MacCursorAuto;

/*
Handles:
- Base arrow (auto/default)
- Pointer, text, move, grab, resizing, not-allowed
To skip overriding the base arrow: <MacCursorAuto allowBaseCursorOverride={false} />
Exclude element: <div data-mac-cursor-ignore="true" />
*/
