import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/utils/page-layout";
import WorkExperience from "@/components/WorkExperience";
import ExperienceCard from "@/components/ExperienceCard";
import { Layers } from "lucide-react";

// Revalidate every day to check for new data
export const revalidate = 1 * 60 * 60 * 24;

export default function Home() {
  return (
    <PageLayout variant="default" maxWidth="2xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="space-y-4">
          <BlurFade inView>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              hey, i&apos;m akram.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              i&apos;m a cs & finance double major at the university of waterloo
              and i like building stuff, whether it be a passion project or b2b
              saas.
            </p>
          </BlurFade>
        </section>

        <section className="flex justify-center">
          <BlurFade inView>
            <Button variant="outline" className="cursor-pointer text-lg">
              <a href="/projects" className="flex items-center">
                <Layers className="mr-2 h-8 w-8" />
                <p>checkout what i&apos;ve worked on</p>
              </a>
            </Button>
          </BlurFade>
        </section>

        {/* Work Experience */}
        <WorkExperience />

        {/* Education */}
        <section className="space-y-4">
          <BlurFade inView>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              education
            </h2>

            <ExperienceCard
              exp={{
                image: "/uwaterloo_logo.jpeg",
                title: "Bachelor of Computer Science & Financial Management",
                company: "University of Waterloo",
                employment_type: "Full-time",
                duration: "Sept 2024 - Present",
                location: "Waterloo, ON, Canada",
                description:
                  "Double major in Computer Science and Financial Management",
                skills: [],
              }}
              index={0}
            />
          </BlurFade>
        </section>
      </div>
    </PageLayout>
  );
}
