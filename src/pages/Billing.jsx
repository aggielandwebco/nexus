import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/mo',
    features: ['Up to 100 customers', 'Basic CRM features', 'Review management', 'Calendar booking'],
  },
  {
    name: 'Business',
    price: '$99',
    period: '/mo',
    features: ['Up to 500 customers', 'AI tools', 'Full analytics', 'Priority support', 'Social media tools'],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$199',
    period: '/mo',
    features: ['Unlimited customers', 'All features', 'Priority support', 'Custom integrations', 'Dedicated account manager'],
  },
];

export default function Billing() {
  const { business } = useBusiness();
  const currentPlan = business?.plan || 'Business';

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Billing</h1>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
        {plans.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          return (
            <Card
              key={plan.name}
              className={`p-5 bg-card border-border flex flex-col ${
                plan.highlighted ? 'ring-1 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                {isCurrent && <Badge className="bg-primary/20 text-primary">Current</Badge>}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="outline" className="w-full border-border">
                  Manage Billing
                </Button>
              ) : (
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Upgrade
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
