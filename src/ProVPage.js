import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaRocket, FaUserGraduate, FaVideo, FaFileAlt, FaHeadset, FaCertificate, FaLock } from 'react-icons/fa';

const ProVPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const features = [
    {
      icon: <FaVideo className="text-4xl" />,
      title: "Premium Video Content",
      description: "Access to exclusive HD video tutorials and courses"
    },
    {
      icon: <FaHeadset className="text-4xl" />,
      title: "1-on-1 Mentoring",
      description: "Personal guidance from industry experts"
    },
    {
      icon: <FaCertificate className="text-4xl" />,
      title: "Verified Certificates",
      description: "Industry-recognized certificates upon completion"
    },
    {
      icon: <FaFileAlt className="text-4xl" />,
      title: "Interview Prep Kit",
      description: "Exclusive access to interview questions and materials"
    }
  ];

  const plans = {
    monthly: {
      price: "₹999",
      period: "/month",
      savings: ""
    },
    yearly: {
      price: "₹799",
      period: "/month",
      savings: "Save 20%"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] to-[#003049] text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center items-center mb-4">
          <FaCrown className="text-5xl text-yellow-400 mr-3" />
          <h1 className="text-5xl font-bold">Pro-V</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Unlock your full potential with Pro Vidyavistar
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
          >
            <div className="text-yellow-400 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pricing Section */}
      <div className="max-w-4xl mx-auto">
        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-1">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-yellow-400 text-[#003049]'
                  : 'text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedPlan === 'yearly'
                  ? 'bg-yellow-400 text-[#003049]'
                  : 'text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center relative overflow-hidden"
        >
          {selectedPlan === 'yearly' && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-[#003049] px-3 py-1 rounded-full text-sm font-semibold">
              {plans[selectedPlan].savings}
            </div>
          )}
          
          <FaRocket className="text-5xl text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pro-V Premium</h2>
          <div className="text-4xl font-bold mb-2">
            {plans[selectedPlan].price}
            <span className="text-xl font-normal text-gray-300">
              {plans[selectedPlan].period}
            </span>
          </div>

          {/* Feature List */}
          <ul className="text-left space-y-4 mb-8">
            {[
              "All Premium Video Content",
              "Unlimited 1-on-1 Mentoring Sessions",
              "Verified Certificates",
              "Interview Preparation Kit",
              "Priority Support",
              "Offline Downloads",
              "Ad-free Experience",
              "Early Access to New Content"
            ].map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center"
              >
                <FaLock className="text-yellow-400 mr-2" />
                {feature}
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-yellow-400 text-[#003049] py-4 px-8 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
          >
            Get Pro-V Now
          </motion.button>

          <p className="mt-4 text-sm text-gray-300">
            7-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Pro-V Members Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Priya Sharma",
              role: "Software Engineer",
              text: "Pro-V transformed my career. The mentoring sessions were invaluable!"
            },
            {
              name: "Rahul Verma",
              role: "Data Scientist",
              text: "The premium content and certification helped me land my dream job."
            },
            {
              name: "Anita Patel",
              role: "UX Designer",
              text: "Best investment in my education. The quality of content is outstanding."
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            >
              <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <FaUserGraduate className="text-[#003049]" />
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-300">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProVPage;
