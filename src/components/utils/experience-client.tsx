"use client";

import React, { useState } from "react";
import ExperienceCard from "../ExperienceCard";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Experience } from "@/types";

interface WorkExperienceClientProps {
  experiences: Experience[];
}

function WorkExperienceClient({ experiences }: WorkExperienceClientProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 4);

  return (
    <section className="space-y-6">
      <BlurFade inView>
        <h2 className="text-2xl font-semibold text-foreground">
          some places i&apos;ve worked:
        </h2>
      </BlurFade>
      <div className="margin-0 space-y-6">
        {displayedExperiences.map((exp, index) => (
          <BlurFade key={index} delay={0.25 + index * 0.05}>
            <ExperienceCard exp={exp} index={index} />
          </BlurFade>
        ))}
        {experiences.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="cursor-pointer px-6 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {showAll ? "show less" : "show more experiences"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkExperienceClient;
