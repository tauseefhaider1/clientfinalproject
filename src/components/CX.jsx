import React, { useState } from 'react';

const CX = () => {
  const [faqs, setFaqs] = useState({}); // Corrected state name to match the state variable

  const toggleFaq = (id) => {
    setFaqs(prev => ({
      ...prev,
      [id]: !prev[id],  // Toggle the boolean value of the specific FAQ by ID
    }));
  };

  const faqss = [
    {
      id: 1,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy. Items must be unused and in original packaging...',
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days...',
    },
    {
      id: 3,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide...',
    },
    // More FAQ items...
  ];

  return (
    <>
      {faqss.map((fa) => {
        return (
          <div key={fa.id}>
            <button onClick={() => toggleFaq(fa.id)}>
              <p>{fa.question}</p>
            </button>

            {faqs[fa.id] && <p>{fa.answer}</p>}  {/* Fixed to use 'fa.answer' */}
          </div>
        );
      })}
    </>
  );
};

export default CX;
