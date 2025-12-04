export const sampleForms = [
  {
    id: "1",
    title: "VibeForm Survey 1",
    description: "Test survey",
    questions: [
      { id: "q1", type: "short", question: "How was your day?" },
      { id: "q2", type: "emoji", options: ["😃","😐","😢"] },
    ],
    responses: [
      { answers: { q1: "Good", q2: "😃" }, vibePoints: 22 },
      { answers: { q1: "Bad", q2: "😢" }, vibePoints: 12 },
    ],
  },
  // more forms
];
