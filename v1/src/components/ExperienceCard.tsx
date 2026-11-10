import React from "react";
import Image from "next/image";

type ExperienceCardProps = {
  exp: {
    image: string;
    title: string;
    company: string;
    employment_type: string;
    duration: string;
    location: string;
    description: string;
    skills: string[];
  };
  index: number;
};

function ExperienceCard({ exp, index }: ExperienceCardProps) {
  return (
    <div
      key={index}
      className="group relative bg-card border border-border rounded-lg p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 hover:border-border/80 dark:hover:shadow-white/5"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={exp.image}
            alt={`${exp.company} logo`}
            width={60}
            height={60}
            className="rounded-xl ring-1 ring-border/50 transition-all duration-300 group-hover:ring-2 group-hover:ring-border"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
            <div>
              <h3 className="text-lg font-semibold text-foreground leading-tight transition-colors duration-300 group-hover:text-primary">
                {exp.title}
              </h3>
              <p className="text-primary font-medium transition-colors duration-300 group-hover:text-primary/80">
                {exp.company}
              </p>
            </div>
            <div className="text-sm text-muted-foreground text-right transition-colors duration-300 group-hover:text-foreground/80">
              <p className="font-medium whitespace-nowrap">{exp.duration}</p>
              {exp.location && (
                <p className="text-xs whitespace-nowrap">{exp.location}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
