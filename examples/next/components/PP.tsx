interface PPProps {
  data: unknown;
  open?: boolean;
}

const PP = ({ data, open = true }: PPProps) => {
  // Convert data to a formatted JSON string
  const formattedData = JSON.stringify(data, null, 2);

  return (
    <section className="adjust-for-header bg-background p-4 rounded-lg">
      <div className="container mx-auto">
        <div className="w-full max-w-4xl my-4 overflow-hidden font-mono text-sm border rounded-lg shadow-xl border-slate-700 bg-slate-900">
          <details open={open} className="group">
            <summary className="flex items-center justify-between px-4 py-2 list-none transition-colors cursor-pointer bg-slate-800 text-slate-300 hover:bg-slate-700">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-400">Data Inspector</span>
                <span className="text-xs text-slate-500">({typeof data})</span>
              </div>
              {/* Arrow Icon */}
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <div className="p-4 overflow-x-auto text-emerald-400">
              <pre className="whitespace-pre-wrap wrap-break-words">
                <code>{formattedData}</code>
              </pre>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default PP;
