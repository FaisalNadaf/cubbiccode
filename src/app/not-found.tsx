import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-canvas pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid-steel [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
      </div>
      <div className="container-x relative text-center">
        <p className="kicker justify-center">Error 404</p>
        <h1 className="mx-auto mt-5 font-display text-7xl font-bold tracking-tightest text-ink sm:text-8xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-steel-600">
          The page you're looking for has moved or no longer exists. Let's get you
          back to building something great.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" arrow>
            Back to home
          </Button>
          <Button href="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
