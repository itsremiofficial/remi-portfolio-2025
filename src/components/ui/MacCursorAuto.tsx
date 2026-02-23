import React, { useEffect } from "react";
import { assetUrl } from "../../utils/assetUrl";

// UPDATED: include base arrow mapping (previously only CSS handled this)
const CURSOR_MAP: Record<string, string> = {
  auto: `url("${assetUrl("/cursors/default.svg")}") 1 1, default`,
  default: `url("${assetUrl("/cursors/default.svg")}") 1 1, default`,
  pointer: `url("${assetUrl("/cursors/handpointing.svg")}") 8 4, pointer`,
  text: `url("${assetUrl("/cursors/textcursor.svg")}") 8 2, text`,
  move: `url("${assetUrl("/cursors/move.svg")}") 16 16, move`,
  grab: `url("${assetUrl("/cursors/handopen.svg")}") 6 4, grab`,
  grabbing: `url("${assetUrl("/cursors/handgrabbing.svg")}") 6 8, grabbing`,
  "not-allowed": `url("${assetUrl("/cursors/notallowed.svg")}") 16 16, not-allowed`,
  // "ew-resize": `url("${assetUrl("/cursors/mac-ew-resize.png")}") 16 16, ew-resize`,
  // "ns-resize": `url("${assetUrl("/cursors/mac-ns-resize.png")}") 16 16, ns-resize`,
  // "nesw-resize": `url("${assetUrl("/cursors/mac-nesw-resize.png")}") 16 16, nesw-resize`,
  // "nwse-resize": `url("${assetUrl("/cursors/mac-nwse-resize.png")}") 16 16, nwse-resize`,
};

// Allow list only for values we still ignore
const IGNORED_VALUES = new Set(["inherit", "initial", "unset"]);

// const isCustomAlready = (val: string) => /url\(/i.test(val);

interface MacCursorAutoProps {
  // If false, will not override the base auto/default cursors
  allowBaseCursorOverride?: boolean;
  // Limit max elements per scan to avoid huge DOM cost (0 = unlimited)
  scanLimit?: number;
}

const MacCursorAuto: React.FC<MacCursorAutoProps> = ({
  // Change default to true to ensure default cursor is replaced
  allowBaseCursorOverride = true,
  scanLimit = 0,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Efficient element state tracking
    const elementStates = new WeakMap<
      HTMLElement,
      {
        originalCursor: string;
        originalStyle: string | null;
        inSpecialState: boolean;
      }
    >();

    // Efficient batched processing queue
    const queue = new Set<HTMLElement>();
    let processingScheduled = false;
    const BATCH_SIZE = 200; // Process this many elements per frame

    // Enqueue an element for cursor processing
    const enqueueElement = (el: Element | null) => {
      if (
        !el ||
        !(el instanceof HTMLElement) ||
        el.dataset.macCursorIgnore === "true"
      )
        return;
      queue.add(el);
      scheduleProcessing();
    };

    // Schedule queue processing on next animation frame
    const scheduleProcessing = () => {
      if (processingScheduled) return;
      processingScheduled = true;
      requestAnimationFrame(processQueue);
    };

    // Process elements in batches to avoid frame drops
    const processQueue = () => {
      processingScheduled = false;

      let processed = 0;
      for (const el of queue) {
        queue.delete(el);
        applyForElement(el);

        if (++processed >= BATCH_SIZE) {
          // If we hit our batch limit, schedule another frame
          scheduleProcessing();
          break;
        }
      }
    };

    // More selective text field detection
    const isTextField = (el: HTMLElement): boolean => {
      // Form inputs that are definitely text fields
      if (
        el instanceof HTMLInputElement &&
        (el.type === "text" ||
          el.type === "password" ||
          el.type === "email" ||
          el.type === "search" ||
          el.type === "tel" ||
          el.type === "url" ||
          el.type === "")
      ) {
        return true;
      }

      // Textarea and contenteditable are always text fields
      if (el instanceof HTMLTextAreaElement) return true;
      if (el.getAttribute("contenteditable") === "true") return true;
      if (el.isContentEditable) return true;

      // Check if it's a text-specific element with selectable text
      // Only consider paragraph, text blocks and other text-specific elements
      if (/^(p|h[1-6])$/i.test(el.tagName)) {
        // Only if user-select indicates text selection is intended
        const userSelect = window.getComputedStyle(el).userSelect;
        if (userSelect === "text" || userSelect === "all") return true;
      }

      // More restrictive class matching - only explicit text classes
      if (
        el.className &&
        /(^|\s)(text-content|editable|rich-text|text-field)(\s|$)/i.test(
          el.className,
        )
      ) {
        return true;
      }

      // Do NOT rely on computed cursor as it creates a circular dependency
      return false;
    };

    // Apply cursor to element
    const applyForElement = (el: HTMLElement) => {
      if (el.dataset.macCursorIgnore === "true") return;

      // Handle special cases first
      if (handleSpecialStates(el)) return;

      // Text field detection
      if (isTextField(el)) {
        el.style.setProperty("cursor", CURSOR_MAP["text"], "important");
        return;
      }

      // Check for interactive elements that should have pointer cursor
      if (isInteractive(el)) {
        el.style.setProperty("cursor", CURSOR_MAP["pointer"], "important");
        return;
      }

      // Handle computed cursor
      const computed = getComputedStyle(el).cursor.trim();

      // Explicit text cursor in computed style
      if (computed === "text") {
        el.style.setProperty("cursor", CURSOR_MAP["text"], "important");
        return;
      }

      // Skip if empty or ignored
      if (!computed || IGNORED_VALUES.has(computed)) return;

      // Handle auto/default cursors
      if (computed === "auto" || computed === "default") {
        if (allowBaseCursorOverride) {
          el.style.setProperty("cursor", CURSOR_MAP["default"], "important");
        }
        return;
      }

      // All other cursor types
      const mapped = CURSOR_MAP[computed];
      if (mapped) {
        el.style.setProperty("cursor", mapped, "important");
      }
    };

    // Check if element is interactive and should have pointer cursor
    const isInteractive = (el: HTMLElement): boolean => {
      const tagName = el.tagName.toLowerCase();

      // Standard interactive elements
      if (
        tagName === "a" ||
        tagName === "button" ||
        tagName === "summary" ||
        tagName === "select"
      ) {
        return true;
      }

      // Inputs that are clickable controls
      if (
        el instanceof HTMLInputElement &&
        (el.type === "button" ||
          el.type === "submit" ||
          el.type === "reset" ||
          el.type === "checkbox" ||
          el.type === "radio")
      ) {
        return true;
      }

      // Elements with button or link roles
      if (
        el.getAttribute("role") === "button" ||
        el.getAttribute("role") === "link"
      ) {
        return true;
      }

      // Elements with pointer classes
      if (/(^|\s)(clickable|btn|button|link)(\s|$)/i.test(el.className)) {
        return true;
      }

      // Check for click event listeners (approximate)
      if (el.hasAttribute("onclick") || el.hasAttribute("ng-click")) {
        return true;
      }

      return false;
    };

    // Handle dragging and special state transitions
    const handleSpecialStates = (el: HTMLElement): boolean => {
      const hasDraggingClass =
        el.classList.contains("is-dragging") ||
        el.classList.contains("dragging");
      const isGrabbed = el.getAttribute("aria-grabbed") === "true";
      const isDraggable = el.getAttribute("draggable") === "true";

      // Get or create state
      const state = elementStates.get(el) || {
        originalCursor: "",
        originalStyle: el.style.cursor,
        inSpecialState: false,
      };

      // Handle drag states
      if (hasDraggingClass || isGrabbed) {
        if (!state.inSpecialState) {
          state.originalCursor = getComputedStyle(el).cursor;
          state.originalStyle = el.style.cursor;
          state.inSpecialState = true;
          elementStates.set(el, state);
        }
        el.style.cursor = CURSOR_MAP["grabbing"];
        return true;
      } else if (state.inSpecialState) {
        // Exiting special state
        state.inSpecialState = false;

        if (isDraggable) {
          el.style.cursor = CURSOR_MAP["grab"];
        } else if (state.originalStyle) {
          el.style.cursor = state.originalStyle;
        } else {
          el.style.removeProperty("cursor");
        }

        elementStates.set(el, state);
        return true;
      }

      return false;
    };

    // Enhanced scan to include root elements
    const scanElements = () => {
      // Start with root elements
      if (allowBaseCursorOverride) {
        // Apply to html and body to ensure default cursor is replaced
        document.documentElement.style.setProperty(
          "cursor",
          CURSOR_MAP["default"],
          "important",
        );

        if (document.body) {
          document.body.style.setProperty(
            "cursor",
            CURSOR_MAP["default"],
            "important",
          );
        }
      }

      // Scan all elements
      const root = document.body || document.documentElement;
      const all = root.querySelectorAll<HTMLElement>("*");

      let count = 0;
      const limit = scanLimit || Infinity;

      for (const el of all) {
        if (count++ >= limit) break;
        enqueueElement(el);
      }
    };

    // Single consolidated mutation observer
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          if (target instanceof HTMLElement) {
            enqueueElement(target);
          }
        } else if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              enqueueElement(node);

              // Use TreeWalker for efficient traversal of large subtrees
              const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_ELEMENT,
              );

              let count = 0;
              const limit = scanLimit || 1000; // Limit how deep we go per added node

              while (walker.nextNode() && count++ < limit) {
                enqueueElement(walker.currentNode as HTMLElement);
              }
            }
          });
        }
      }
    });

    // Start observing with a unified observer
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "class",
        "style",
        "data-cursor",
        "data-mac-cursor-ignore",
        "disabled",
        "readonly",
        "draggable",
        "aria-grabbed",
        "contenteditable",
      ],
    });

    // Pointer event handlers (more efficient than multiple mouse events)
    const handlePointer = (e: Event) => {
      enqueueElement(e.target as HTMLElement);
    };

    // Handle drag events
    const handleDrag = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLElement)) return;

      const state = elementStates.get(target) || {
        originalCursor: getComputedStyle(target).cursor,
        originalStyle: target.style.cursor,
        inSpecialState: false,
      };

      if (e.type === "dragstart") {
        state.inSpecialState = true;
        elementStates.set(target, state);
        target.style.cursor = CURSOR_MAP["grabbing"];
      } else if (e.type === "dragend") {
        state.inSpecialState = false;

        if (target.getAttribute("draggable") === "true") {
          target.style.cursor = CURSOR_MAP["grab"];
        } else if (state.originalStyle) {
          target.style.cursor = state.originalStyle;
        } else {
          target.style.removeProperty("cursor");
        }

        elementStates.set(target, state);
        enqueueElement(target); // Re-check after drag
      }
    };

    // Focus events for text inputs
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLElement && isTextField(target)) {
        target.style.setProperty("cursor", CURSOR_MAP["text"], "important");
      }
    };

    // Register unified event listeners
    document.addEventListener("pointerover", handlePointer, { passive: true });
    document.addEventListener("pointerdown", handlePointer, { passive: true });
    document.addEventListener("pointerup", handlePointer, { passive: true });
    document.addEventListener("dragstart", handleDrag);
    document.addEventListener("dragend", handleDrag);
    document.addEventListener("focusin", handleFocus, { passive: true });

    // Initial scan with a small delay to let page stabilize
    setTimeout(scanElements, 0);

    // Also scan when document is fully loaded
    if (document.readyState !== "complete") {
      window.addEventListener("load", scanElements, { once: true });
    }

    // Force common element types to have correct cursors
    const forceCommonElementCursors = () => {
      // Force default cursor on body and html if allowed
      if (allowBaseCursorOverride) {
        document.documentElement.style.setProperty(
          "cursor",
          CURSOR_MAP["default"],
          "important",
        );
        if (document.body) {
          document.body.style.setProperty(
            "cursor",
            CURSOR_MAP["default"],
            "important",
          );
        }
      }

      // Pointer cursor - ONLY for clearly interactive elements
      document
        .querySelectorAll(
          'a, button, [role="button"], input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], summary, select, .btn, .button, .clickable',
        )
        .forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.setProperty("cursor", CURSOR_MAP["pointer"], "important");
          }
        });

      // Text cursor - ONLY for text input elements and content editable
      document
        .querySelectorAll(
          'input[type="text"], input[type="password"], input[type="email"], input[type="search"], input[type="tel"], input[type="url"], textarea, [contenteditable="true"], .text-field, .text-input, h1,h2,h3,h4,h5,h6,p,li',
        )
        .forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.setProperty("cursor", CURSOR_MAP["text"], "important");
          }
        });

      // Draggables
      document.querySelectorAll('[draggable="true"]').forEach((el) => {
        if (
          el instanceof HTMLElement &&
          !el.classList.contains("is-dragging")
        ) {
          el.style.setProperty("cursor", CURSOR_MAP["grab"], "important");
        }
      });
    };

    // More immediate initialization
    scanElements();
    forceCommonElementCursors();

    // Run again after a brief delay
    setTimeout(() => {
      scanElements();
      forceCommonElementCursors();
    }, 100);

    // Ensure cursors apply when document is fully loaded
    if (document.readyState !== "complete") {
      window.addEventListener(
        "load",
        () => {
          scanElements();
          forceCommonElementCursors();

          // One more time after a short delay to catch any late changes
          setTimeout(() => {
            scanElements();
            forceCommonElementCursors();
          }, 200);
        },
        { once: true },
      );
    }

    return () => {
      observer.disconnect();
      document.removeEventListener("pointerover", handlePointer);
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("pointerup", handlePointer);
      document.removeEventListener("dragstart", handleDrag);
      document.removeEventListener("dragend", handleDrag);
      document.removeEventListener("focusin", handleFocus);
      queue.clear();
    };
  }, [allowBaseCursorOverride, scanLimit]);

  return null;
};

/*
Handles:
- Base arrow (auto/default)
- Pointer, text, move, grab, resizing, not-allowed
To skip overriding the base arrow: <MacCursorAuto allowBaseCursorOverride={false} />
Exclude element: <div data-mac-cursor-ignore="true" />
*/
export default MacCursorAuto;
