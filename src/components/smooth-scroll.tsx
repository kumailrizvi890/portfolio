"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
  Smooth scroll + the one animation loop everything else hangs off.

  The three lines that matter are the sync: ScrollTrigger updates on every
  Lenis scroll event, Lenis steps from the GSAP ticker rather than opening its
  own requestAnimationFrame, and lagSmoothing is off so a dropped frame cannot
  desync a scrubbed timeline. Two independent rAF loops is the usual reason
  scroll-driven work stutters.

  Reduced motion needs nothing here: Lenis honours prefers-reduced-motion by
  default, forcing lerp to 1 so scroll tracks the wheel exactly and anchor
  jumps are instant, while still running so ScrollTrigger stays in sync.

  Mounted once in the root layout. Renders nothing.
*/

export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.11,
      anchors: { offset: -80 },
      // Anything that scrolls inside itself opts out by attribute.
      prevent: (node) => node.hasAttribute?.("data-lenis-prevent"),
      stopInertiaOnNavigate: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pinned and scrubbed sections measure wrong if they are laid out before
    // the webfonts land and reflow the text.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
