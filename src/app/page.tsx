import { Hero, Showcase, WorkedAt } from "@/components/home/hero";
import {
  ClosingCta,
  Education,
  Experience,
  Pillars,
  Spotlight,
  Statement,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkedAt />
      <Showcase />
      <Statement />
      <Pillars />
      <Spotlight />
      <Experience />
      <Education />
      <ClosingCta />
    </>
  );
}
