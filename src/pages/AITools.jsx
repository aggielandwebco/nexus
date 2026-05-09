import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useBusiness } from '@/hooks/useBusiness';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AITools() {
  const { business } = useBusiness();

  // Review Responder state
  const [reviewInput, setReviewInput] = useState('');
  const [reviewTone, setReviewTone] = useState('Professional');
  const [reviewOutput, setReviewOutput] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Follow-up Email state
  const [emailCustomerId, setEmailCustomerId] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [emailOutput, setEmailOutput] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Social Media state
  const [socialTopic, setSocialTopic] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('Instagram');
  const [socialOutput, setSocialOutput] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: () => base44.entities.Customer.filter({ business_id: business.id }),
    enabled: !!business?.id,
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateReviewResponse = async () => {
    if (!reviewInput.trim()) return;
    setReviewLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a ${reviewTone.toLowerCase()} business representative. Generate a response to this customer review. Keep it concise, authentic, and helpful.\n\nReview: "${reviewInput}"`,
    });
    setReviewOutput(result);
    setReviewLoading(false);
  };

  const generateFollowUpEmail = async () => {
    if (!emailCustomerId || !emailContext.trim()) return;
    const customer = customers.find(c => c.id === emailCustomerId);
    setEmailLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a follow-up email for a business (${business?.name || 'our company'}) to a customer named ${customer?.name || 'Customer'}. Context: ${emailContext}. Keep it professional and concise. Include a subject line.`,
    });
    setEmailOutput(result);
    setEmailLoading(false);
  };

  const generateSocialCaption = async () => {
    if (!socialTopic.trim()) return;
    setSocialLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a social media caption for ${socialPlatform}. Business: ${business?.name || 'our business'}. Topic/Offer: ${socialTopic}. Make it engaging, include relevant emojis, and keep it platform-appropriate for ${socialPlatform}. Include relevant hashtags.`,
    });
    setSocialOutput(result);
    setSocialLoading(false);
  };

  const OutputSection = ({ output, setOutput, loading }) => (
    <div className="mt-4">
      {loading ? (
        <div className="flex items-center gap-2 p-4 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
          Generating...
        </div>
      ) : output ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Generated Output</span>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output)}>
              <Copy className="w-3 h-3 mr-1" /> Copy
            </Button>
          </div>
          <Textarea value={output} onChange={e => setOutput(e.target.value)} rows={6} className="bg-secondary border-border" />
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">AI Tools</h1>

      <Tabs defaultValue="review" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="review">Review Responder</TabsTrigger>
          <TabsTrigger value="email">Follow-Up Email</TabsTrigger>
          <TabsTrigger value="social">Social Caption</TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <Card className="p-5 bg-card border-border space-y-4">
            <div>
              <Label className="text-muted-foreground">Customer Review</Label>
              <Textarea value={reviewInput} onChange={e => setReviewInput(e.target.value)} placeholder="Paste the review here..." rows={3} className="bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Tone</Label>
              <Select value={reviewTone} onValueChange={setReviewTone}>
                <SelectTrigger className="bg-secondary border-border w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReviewResponse} disabled={reviewLoading || !reviewInput.trim()} className="bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Response
            </Button>
            <OutputSection output={reviewOutput} setOutput={setReviewOutput} loading={reviewLoading} />
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-5 bg-card border-border space-y-4">
            <div>
              <Label className="text-muted-foreground">Customer</Label>
              <Select value={emailCustomerId} onValueChange={setEmailCustomerId}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Context</Label>
              <Textarea value={emailContext} onChange={e => setEmailContext(e.target.value)} placeholder="Describe the follow-up reason..." rows={3} className="bg-secondary border-border" />
            </div>
            <Button onClick={generateFollowUpEmail} disabled={emailLoading || !emailCustomerId || !emailContext.trim()} className="bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Email
            </Button>
            <OutputSection output={emailOutput} setOutput={setEmailOutput} loading={emailLoading} />
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-5 bg-card border-border space-y-4">
            <div>
              <Label className="text-muted-foreground">Topic / Offer</Label>
              <Input value={socialTopic} onChange={e => setSocialTopic(e.target.value)} placeholder="e.g., 20% off this weekend" className="bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-muted-foreground">Platform</Label>
              <Select value={socialPlatform} onValueChange={setSocialPlatform}>
                <SelectTrigger className="bg-secondary border-border w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Google Post">Google Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateSocialCaption} disabled={socialLoading || !socialTopic.trim()} className="bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Caption
            </Button>
            <OutputSection output={socialOutput} setOutput={setSocialOutput} loading={socialLoading} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
