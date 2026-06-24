import { Code2 } from "lucide-react";

// Vector mark instead of a raster image: stays crisp at any size and is built
// from the same indigo→purple gradient used in the hero/buttons, so it can't
// drift out of sync with the theme the way an uploaded image can.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600"
      style={{ width: size, height: size }}
    >
      <Code2 size={Math.round(size * 0.55)} className="text-white" strokeWidth={2.5} />
    </div>
  );
}
