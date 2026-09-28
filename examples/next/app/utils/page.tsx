export default function UtilsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Utility Functions</h1>

      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-800 p-4">
          <h3 className="font-medium">formatPrice</h3>
          <p className="text-sm text-zinc-400">
            Formats numbers based on locale and currency.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-800 p-4">
          <h3 className="font-medium">debounce</h3>
          <p className="text-sm text-zinc-400">
            Prevents excessive function calls.
          </p>
        </div>
      </div>
    </div>
  );
}
