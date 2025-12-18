const eventTypeQuestions = {
  business: [
    {
      type: "short",
      question: "Full Name",
      placeholder: "John Smith",
      options: [],
      required: true,
    },
    {
      type: "email",
      question: "Email Address",
      placeholder: "john@company.com",
      options: [],
      required: true,
    },
    {
      type: "short",
      question: "Company Name",
      placeholder: "Acme Corp",
      options: [],
      required: false,
    },
    {
      type: "short",
      question: "Job Title",
      placeholder: "Product Manager",
      options: [],
      required: false,
    },
  ],

  tech: [
    {
      type: "short",
      question: "Full Name",
      placeholder: "Alex Chen",
      options: [],
      required: true,
    },
    {
      type: "email",
      question: "Email Address",
      placeholder: "alex@gmail.com",
      options: [],
      required: true,
    },
    {
      type: "multiple",
      question: "Skill Level",
      options: ["Beginner", "Intermediate", "Advanced"],
      sampleAnswer: "Intermediate",
      required: true,
    },
  ],
};

export default eventTypeQuestions;
