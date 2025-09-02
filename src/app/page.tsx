import PageLayout from "@/components/utils/page-layout";

export default function Home() {
  return (
    <PageLayout variant="default" maxWidth="2xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            hi, i&apos;m akram 👋
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            I&apos;m a passionate developer creating meaningful digital
            experiences. Explore my projects, read my thoughts, and get to know
            my work.
          </p>
        </section>

        {/* Content Section */}
        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
            totam accusamus dolorum, molestias at, ut vitae, accusantium magnam
            maxime facilis animi distinctio perferendis quisquam quam delectus
            itaque nulla beatae praesentium? Quo iusto, recusandae at, quam
            voluptatibus laudantium iure enim incidunt esse temporibus
            excepturi!
          </p>

          <p className="text-base leading-relaxed">
            Dolores, aperiam alias doloribus magnam veritatis laborum ratione
            cumque. Rem exercitationem aliquid repellat iste tempora quidem
            ipsam. Perspiciatis tempora, sed tenetur, magnam quisquam commodi ab
            aspernatur odio magni repellendus inventore accusamus, adipisci eum
            quidem iusto.
          </p>

          <p className="text-base leading-relaxed">
            Aliquam facilis quidem rem nobis molestias odit pariatur amet,
            perferendis ut nesciunt? Optio dolor neque aliquid temporibus a
            fugit delectus rerum nostrum vero repellat, aliquam natus, impedit
            similique, in fuga eveniet perspiciatis? Harum culpa a autem vel,
            iste possimus accusamus suscipit quas.
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Ready to collaborate?</h2>
          <p className="text-muted-foreground mb-6">
            Let&apos;s build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              View My Work
            </button>
            <button className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors">
              Get In Touch
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
