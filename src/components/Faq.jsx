// components/Faq.jsx
import React, { useState } from 'react';
import { 
  HelpOutline, 
  LocalShipping, 
  Payment, 
  Refresh, 
  Security, 
  SupportAgent,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

const FAQ = () => {
  const [openFaqs, setOpenFaqs] = useState({});

  const toggleFaq = (id) => {
    setOpenFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqs = [
    {
      id: 1,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy. Items must be unused and in original packaging. Contact us within 30 days of delivery for returns.',
      icon: <Refresh />
    },
    {
      id: 2,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Delivery times may vary by location.',
      icon: <LocalShipping />
    },
    {
      id: 3,
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.',
      icon: <LocalShipping />
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, MasterCard, American Express, PayPal, and Apple Pay. All payments are secure and encrypted.',
      icon: <Payment />
    },
    {
      id: 5,
      question: 'Is my payment information secure?',
      answer: 'Yes, we use SSL encryption and comply with PCI security standards. We never store your full payment details.',
      icon: <Security />
    },
    {
      id: 6,
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can track your order on our website.',
      icon: <HelpOutline />
    },
    {
      id: 7,
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer complimentary gift wrapping. You can add a gift message during checkout.',
      icon: <HelpOutline />
    },
    {
      id: 8,
      question: 'How can I contact customer service?',
      answer: 'You can contact us via email at support@store.com, phone at 1-800-123-4567, or live chat on our website.',
      icon: <SupportAgent />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about our store, shipping, and policies
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex items-start">
                  <div className="text-blue-600 dark:text-blue-400 mr-4 mt-1">
                    {faq.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {openFaqs[faq.id] ? <ExpandLess /> : <ExpandMore />}
                </div>
              </button>
              
              {openFaqs[faq.id] && (
                <div className="px-6 pb-4 ml-12">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800/30">
          <div className="text-center">
            <SupportAgent className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our customer support team is here to help you
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                Contact Support
              </button>
              <button className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200">
                Live Chat
              </button>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Email: support@store.com</p>
              <p>Phone: 1-800-123-4567</p>
              <p>Hours: Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;