import PageLayout from "@/components/utils/page-layout";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import experiences from "./linkedin.json";
import Image from "next/image";

export default function Home() {
  return (
    <PageLayout variant="narrow" maxWidth="2xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            hey, i&apos;m akram.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            i&apos;m a cs & finance double major at the university of waterloo
            and i like building stuff, whether it be a passion project or b2b
            saas.
          </p>
        </section>
        {/* Work Experience */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            some places i&apos;ve worked:
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-lg p-6"
              >
                <div className="flex gap-4">
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
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground leading-tight">
                          {exp.title}
                        </h3>
                        <p className="text-primary font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <p className="font-medium">{exp.duration}</p>
                        {exp.location && (
                          <p className="text-xs">{exp.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
