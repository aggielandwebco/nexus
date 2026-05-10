import { useMemo, useState } from "react";
import { CheckCircle, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KPICard from "@/components/shared/KPICard";
import StarRating from "@/components/shared/StarRating";

const PLATFORMS = ["Google", "Yelp", "Facebook"];

export default function Reviews() {
  const [ratingFilter, setRatingFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  // This keeps the page stable while the Supabase reviews table is added later.
  const reviews = [];

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const matchRating = ratingFilter === "all" || review.rating === Number(ratingFilter);
      const matchPlatform = platformFilter === "all" || review.platform === platformFilter;
      return matchRating && matchPlatform;
    });
  }, [platformFilter, ratingFilter, reviews]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "-";
  const respondedCount = reviews.filter((review) => review.responded).length;
  const respondedPercent = reviews.length > 0 ? Math.round((respondedCount / reviews.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review tracking is ready for the Integris Nexus design system. Supabase review syncing can be connected next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard title="Avg Rating" value={avgRating} icon={Star} />
        <KPICard title="Total Reviews" value={reviews.length} icon={MessageSquare} />
        <KPICard title="Responded" value={`${respondedPercent}%`} icon={CheckCircle} />
      </div>

      <Card className="border-white/10 bg-[#1C1F24] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full bg-[#111315] sm:w-40">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-full bg-[#111315] sm:w-40">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="border-white/10 bg-[#1C1F24] p-10 text-center">
          <p className="font-medium text-foreground">No reviews found.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Once the Supabase reviews table is connected, customer reviews and AI responses will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <Card key={review.id} className="border-white/10 bg-[#1C1F24] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-muted-foreground">{review.platform}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{review.reviewer_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{review.review_text}</p>
                </div>
                <Badge className={review.responded ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                  {review.responded ? "Responded" : "Needs Response"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
