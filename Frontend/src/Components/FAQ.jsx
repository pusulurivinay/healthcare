import React, { useState } from "react";
import "../Styles/FAQ.css";

function FAQ() {
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  function toggleQuestion(index) {
    if (expandedQuestions.includes(index)) {
      setExpandedQuestions(expandedQuestions.filter((item) => item !== index));
    } else {
      setExpandedQuestions([...expandedQuestions, index]);
    }
  }

  return (
    <div className="faq-section">
      <h3 className="faq-title">
      <span>Frequently Asked Questions</span>
        </h3>
      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <button
            className="faq-question"
            onClick={() => toggleQuestion(index)}
            aria-expanded={expandedQuestions.includes(index)}
          >
            {item.question}
          </button>
          {expandedQuestions.includes(index) && (
            <div className="faq-answer">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const faqData = [
  {
    question: "What is Healthify?",
    answer:
      "Healthify is a healthcare provider committed to comprehensive services, personalized care, and wellness support. With a focus on empowerment and compassion, Healthify offers primary and specialty care, preventive screenings, wellness programs, and chronic condition support. It creates a nurturing environment where patients feel valued and empowered to take control of their health. Healthify is dedicated to excellence in healthcare and improving lives through compassionate care.",
  },
  {
    question: "Why choose Healthify?",
    answer: "Insert your answer here...",
  },
  {
    question: "What are the advantages of healthcare?",
    answer: "Insert your answer here...",
  },
  {
    question: "How are we different?",
    answer: "Insert your answer here...",
  },
  {
    question: "Why is home care beneficial for you?",
    answer: "Insert your answer here...",
  },
  {
    question: "Is home care suitable for you?",
    answer: "Insert your answer here...",
  },
  {
    question: "How does Healthify work?",
    answer: "Insert your answer here...",
  },
  {
    question: "Is home care suitable for your family?",
    answer: "Insert your answer here...",
  },
];

export default FAQ;
