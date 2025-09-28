import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/80 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
