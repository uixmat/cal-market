export interface FaqItem {
  answer: string;
  id: string;
  question: string;
}

export const homeFaqItems: FaqItem[] = [
  {
    answer:
      "Yes. If you offer bookable local services and schedule with Cal.com, you can list on Discover. We're starting with curated listings in San Francisco and opening up to more providers soon.",
    id: "list",
    question: "Can anyone list an event or service?",
  },
  {
    answer:
      "No. Discover is a no-commission, no-risk marketplace. When someone books you, they go straight to your Cal.com scheduling link — we don't take a cut.",
    id: "commissions",
    question: "Does Discover charge commissions or fees?",
  },
  {
    answer:
      "Discover helps people find you. When they're ready to book, they tap through to your Cal.com page to pick a time. We don't handle payments, calendar invites, or checkout.",
    id: "bookings",
    question: "How do bookings work?",
  },
  {
    answer:
      "We're launching in San Francisco with dentists, vets, instructors, clubs, and more. AI search defaults to SF when no city is mentioned — more cities are on the way.",
    id: "coverage",
    question: "Which cities does Discover cover?",
  },
];
