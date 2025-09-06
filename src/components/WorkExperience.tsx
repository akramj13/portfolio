"use client";

import React from "react";
import experiences from "./linkedin.json";
import Image from "next/image";
import { useState } from "react";

function WorkExperience() {
  const [showAll, setShowAll] = useState(false);
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 4);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">
        some places i&apos;ve worked:
      </h2>
      <div className="margin-0 space-y-6">
        {displayedExperiences.map((exp, index) => (
          <div
            key={index}
            className="group relative bg-card border border-border rounded-lg p-4"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={exp.image}
                  alt={`${exp.company} logo`}
                  width={60}
                  height={60}
                  className="rounded-xl ring-1 ring-border/50"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {exp.title}
                    </h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <p className="font-medium whitespace-nowrap">
                      {exp.duration}
                    </p>
                    {exp.location && (
                      <p className="text-xs whitespace-nowrap">
                        {exp.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {experiences.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="cursor-pointer px-6 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {showAll
                ? "Show Less"
                : `Show All ${experiences.length} Experiences`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default WorkExperience;
