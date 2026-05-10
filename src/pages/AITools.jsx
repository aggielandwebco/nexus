import { useMemo, useState } from "react";
import { Copy, MessageSquareText, RefreshCw, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    id: "follow-up",
    title: "Follow-up Message",
    icon: MessageSquareText,
    description: "Create a friendly follow-up for a lead or customer."
  },
  {
    id: "review-request",
    title: "Review Request",
    icon: Star,
    description: "Ask a happy customer to leave a review."
  },
  {
    id: "win-back",
    title: "Win-back Message",
    icon: RefreshCw,
    description: "Bring an inactive customer back with a simple offer."
  }
];

function buildMessage(toolId, businessName, customerName, context) {
  const name = customerName || "there";
  const business = businessName || "our team";
  const detail = context ? ` ${context}` : "";

  if (toolId === "review-request") {
    return `Hi ${name}, thank you for choosing ${business}. We really appreciate your support. If you had a good experience, would you mind leaving us a quick review? It helps other local customers find us and means a lot to our business.${detail}`;
  }

  if (toolId === "win-back") {
    return `Hi ${name}, it has been a little while since we last saw you at ${business}. We would love to help again whenever you are ready. Reply here and we can get you scheduled.${detail}`;
  }

  return `Hi ${name}, this is ${business}. I wanted to follow up and see if you still need help. I am happy to answer questions or get you scheduled whenever it works best.${detail}`;
}

export default function AITools() {
  const [selectedTool, setSelectedTool] = useState("follow-up");
  const [businessName, setBusinessName] = useState("Integris Nexus");
  const [customerName, setCustomerName] = useState("");
  const [context, setContext] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => buildMessage(selectedTool, businessName, customerName, context),
    [selectedTool, businessName, customerName, context]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Tools</h1>
        <p className="mt-1 text-muted-foreground">
          Generate customer messages, review requests, and follow-ups.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const active = selectedTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setSelectedTool(tool.id)}
              className={`rounded-xl border p-5 text-left transition ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-semibold text-foreground">{tool.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="space-y-4 border-border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Message Details</h2>
            <p className="text-sm text-muted-foreground">Fill in the basics and Nexus will draft a message.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Business name</label>
            <Input value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Customer name</label>
            <Input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Extra context</label>
            <Textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Optional details, offer, service, or timing..."
              rows={5}
            />
          </div>
        </Card>

        <Card className="flex flex-col border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Generated Draft</h2>
              <p className="text-sm text-muted-foreground">Review before sending to a customer.</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Local Draft
            </Badge>
          </div>

          <div className="min-h-48 flex-1 rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground">
            {output}
          </div>

          <Button onClick={handleCopy} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy Message"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
