import { Star } from "lucide-react";

export default function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= rating ? "fill-primary text-primary" : "text-muted-foreground"}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
