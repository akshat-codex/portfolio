"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// Portfolio edits: heading/intro are props (were hardcoded demo text), beam in signal orange,
// ink/paper colours, measured height follows resizes.
export const Timeline = ({
  data,
  heading,
  intro,
}: {
  data: TimelineEntry[];
  heading?: React.ReactNode;
  intro?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      {heading || intro ? (
        <div className="max-w-7xl mx-auto pb-6 pt-4">
          {heading}
          {intro}
        </div>
      ) : null}

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-32 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-ink flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-signal/25 border border-signal p-2 shadow-[0_0_18px_rgba(255,77,0,0.6)]" />
              </div>
              <h3 className="hidden md:block md:pl-20 text-3xl lg:text-5xl font-bold uppercase leading-[0.95] tracking-[-0.02em] text-paper/45 [font-stretch:115%]">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold uppercase text-paper/60">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-paper/15 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-signal via-[#ff9a4d] to-transparent from-[0%] via-[10%] rounded-full shadow-[0_0_12px_rgba(255,77,0,0.8)]"
          />
        </div>
      </div>
    </div>
  );
};
