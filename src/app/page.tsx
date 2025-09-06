import PageLayout from "@/components/utils/page-layout";
import WorkExperience from "@/components/WorkExperience";

export default function Home() {
  return (
    <PageLayout variant="default" maxWidth="2xl">
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
        <WorkExperience />
      </div>
    </PageLayout>
  );
}
