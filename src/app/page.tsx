import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/utils/page-layout";
import WorkExperience from "@/components/WorkExperience";
import { Layers } from "lucide-react";
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
      </div>
    </PageLayout>
  );
}
