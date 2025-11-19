import { Card } from "@/components/ui/card";

interface PageLoaderProps {
  title?: string;
  subtitle?: string;
}

export function PageLoader({ title = "Cargando", subtitle }: PageLoaderProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-slate-200 rounded-sm animate-pulse" />
        {subtitle !== false && (
          <div className="h-5 w-96 bg-slate-100 rounded-sm animate-pulse" />
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded-sm animate-pulse" />
                  <div className="h-6 w-20 bg-slate-100 rounded-sm animate-pulse" />
                </div>
                <div className="h-12 w-12 bg-slate-200 rounded-sm animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded-sm animate-pulse" />
                <div className="h-3 w-3/4 bg-slate-100 rounded-sm animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{title}...</span>
        </div>
      </div>
    </div>
  );
}

export function FormLoader({
  title = "Cargando formulario",
}: {
  title?: string;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-slate-200 rounded-sm animate-pulse" />
        <div className="h-5 w-96 bg-slate-100 rounded-sm animate-pulse" />
      </div>

      <Card className="p-6 space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded-sm animate-pulse" />
            <div className="h-10 w-full bg-slate-100 rounded-sm animate-pulse" />
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <div className="h-10 w-32 bg-slate-200 rounded-sm animate-pulse" />
          <div className="h-10 w-32 bg-slate-100 rounded-sm animate-pulse" />
        </div>
      </Card>

      <div className="flex justify-center items-center py-4">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{title}...</span>
        </div>
      </div>
    </div>
  );
}

export function GridLoader({
  columns = 5,
  title = "Cargando",
}: {
  columns?: number;
  title?: string;
}) {
  const gridCols =
    {
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-slate-200 rounded-sm animate-pulse" />
        <div className="h-5 w-96 bg-slate-100 rounded-sm animate-pulse" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-slate-100 rounded-sm animate-pulse" />
        <div className="h-10 w-40 bg-slate-100 rounded-sm animate-pulse" />
        <div className="h-10 w-32 bg-orange-100 rounded-sm animate-pulse" />
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[2/3] bg-slate-200 rounded-sm animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded-sm animate-pulse" />
              <div className="h-3 w-3/4 bg-slate-100 rounded-sm animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center py-8">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{title}...</span>
        </div>
      </div>
    </div>
  );
}

export function TableLoader({ title = "Cargando" }: { title?: string }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-slate-200 rounded-sm animate-pulse" />
        <div className="h-5 w-96 bg-slate-100 rounded-sm animate-pulse" />
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-slate-100 rounded-sm animate-pulse" />
        <div className="h-10 w-32 bg-orange-100 rounded-sm animate-pulse" />
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-5 gap-4 pb-4 border-b">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-200 rounded-sm animate-pulse"
            />
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-slate-100 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ))}
      </Card>

      <div className="flex justify-center items-center py-4">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="h-5 w-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{title}...</span>
        </div>
      </div>
    </div>
  );
}
