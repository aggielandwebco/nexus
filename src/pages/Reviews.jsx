import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KPICard from '@/components/shared/KPICard';
import StarRating from '@/components/shared/StarRating';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const PLATFORMS = ['Google', 'Yelp', 'Facebook'];

export default function Reviews() {
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [ratingFilter, setRatingFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', business?.id],
    queryFn: () => base44.entities.Review.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Review.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      setSelectedReview(null);
    },
  });

  const filtered = reviews.filter(r => {
    const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter);
    const matchPlatform = platformFilter === 'all' || r.platform === platformFilter;
    return matchRating && matchPlatform;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';
  const respondedCount = reviews.filter(r => r.responded).length;
  const respondedPercent = reviews.length > 0 ? Math.round((respondedCount / reviews.length) * 100) : 0;

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setResponseText(review.response_text || '');
  };

  const generateResponse = async () => {
    if (!selectedReview) return;
    setGenerating(true);
    const tone = business?.ai_tone || 'Professional';
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a ${tone.toLowerCase()} response to this customer review. Keep it concise and sincere.\n\nReview: "${selectedReview.review_text}"\nRating: ${selectedReview.rating}/5`,
    });
    setResponseText(response);
    setGenerating(false);
  };

  const saveResponse = () => {
    if (!selectedReview) return;
    updateMutation.mutate({
      id: selectedReview.id,
      data: { response_text: responseText, responded: true }
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Reviews</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard title="Avg Rating" value={avgRating} icon={Star} />
        <KPICard title="Total Reviews" value={reviews.length} icon={MessageSquare} />
        <KPICard title="Responded" value={`${respondedPercent}%`} icon={CheckCircle} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-card border-border">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map(r => (
              <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-card border-border">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center bg-card border-border">
          <p className="text-muted-foreground">No reviews found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <Card key={r.id} className="p-4 bg-card border-border cursor-pointer hover:bg-secondary/50" onClick={() => openReviewModal(r)}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={r.rating} />
                    <span className="text-sm text-muted-foreground">{r.platform}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{r.reviewer_name}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.review_text}</p>
                  <p className="text-xs text-muted-foreground mt-2">{format(new Date(r.created_date), 'MMM d, yyyy')}</p>
                </div>
                <Badge className={r.responded ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                  {r.responded ? 'Responded' : 'Needs Response'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Respond to Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="p-3 bg-secondary rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={selectedReview.rating} />
                  <span className="text-sm text-muted-foreground">by {selectedReview.reviewer_name}</span>
                </div>
                <p className="text-sm text-foreground">{selectedReview.review_text}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your Response</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateResponse}
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Generate AI Response'}
                  </Button>
                </div>
                <Textarea
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  rows={4}
                  className="bg-secondary border-border"
                  placeholder="Write your response..."
                />
              </div>
              <Button onClick={saveResponse} disabled={updateMutation.isPending} className="w-full bg-primary text-primary-foreground">
                {updateMutation.isPending ? 'Saving...' : 'Save Response'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
