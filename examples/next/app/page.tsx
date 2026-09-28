import PP from "@/components/PP";
import { Card } from "@/components/ui/Card";
import { T_project } from "@/data";

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Internal Dev Docs
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          A living reference for reusable components, hooks, and utility
          functions used across the app.
        </p>
      </section>

      {/* Sections */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Components</h2>
        {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start justify-start"> */}
        <Card title="Pretty Print" description="Pretty Print any data">
          <PP data={T_project} open={false} />
        </Card>
        {/* </div> */}
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Hooks</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Custom Hooks"
            description="Reusable logic for data, UI, and side effects"
            href="/hooks"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-medium">Utils</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Utility Functions"
            description="Formatting, helpers, pure functions"
            href="/utils"
          />
        </div>
      </section>
    </div>
  );
}
