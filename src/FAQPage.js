import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 dark:border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center focus:outline-none"
      >
        <span className="text-xl font-semibold text-[#003049] dark:text-white">
          {question}
        </span>
        <span className="text-2xl dark:text-white">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-gray-700 dark:text-gray-300"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const FAQPage = () => {
  const faqData = [
    {
      question: "What is Vidyavistar?",
      answer:
        "Vidyavistar is a comprehensive career guidance platform that helps you explore various career paths and connect with industry experts.",
    },
    {
      question: "How do I register on Vidyavistar?",
      answer:
        "You can register by clicking the 'Register' button on the login page and providing the required details. A verification link will be sent to your email.",
    },
    {
      question: "How does email verification work?",
      answer:
        "After registration, a verification email is sent to your email address. You must click the link in that email to verify your account before logging in.",
    },
    {
      question: "What career guidance services are available?",
      answer:
        "We offer personalized career advice, access to industry mentors, detailed career path information, and resources to help you make informed decisions.",
    },
    {
      question: "Can I update my profile information?",
      answer:
        "Yes, once logged in, you can update your profile details from the dashboard to reflect your latest skills and experiences.",
    },
    {
      question: "How do I access career paths information?",
      answer:
        "Career paths are available from your dashboard. Click on the 'Career Paths' section to explore various industries and roles.",
    },
    {
      question: "Is Vidyavistar free to use?",
      answer:
        "Our basic career guidance platform is free. We may offer premium features or personalized coaching at an additional cost.",
    },
    {
      question: "How can I get personalized guidance?",
      answer:
        "After registration, you can book a session with our career experts through the Guidance section on your dashboard.",
    },
    {
      question: "What if I forget my password?",
      answer:
        "If you forget your password, click on the 'Forgot Password' link on the login page. A password reset link will be sent to your registered email.",
    },
    {
      question: "Can I use Vidyavistar on mobile?",
      answer:
        "Yes, our platform is fully responsive and accessible on both desktop and mobile devices.",
    },
    {
      question: "How secure is my data on Vidyavistar?",
      answer:
        "We use industry-standard encryption and follow best practices to protect your personal information and data.",
    },
    {
      question: "How often is new content added?",
      answer:
        "We regularly update our platform with new career paths, industry insights, and expert guidance to keep you informed.",
    },
    {
      question: "Can I connect with industry experts?",
      answer:
        "Yes, through our platform, you can connect with mentors and industry experts for career advice and networking.",
    },
    {
      question: "Is there any cost for accessing internships?",
      answer:
        "Most internship listings on Vidyavistar are free to access. Some premium opportunities may require a membership.",
    },
    {
      question: "How do I contact Vidyavistar support?",
      answer:
        "You can reach our support team via the 'Contact Us' section on the website or email us directly at support@vidyavistar.com.",
    },
  ];

  return (
    <div className="bg-[#fdf7ee] dark:bg-gray-900 min-h-screen w-full py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#003049] dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
