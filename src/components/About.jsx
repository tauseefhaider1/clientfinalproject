// components/About.jsx
import React from 'react';
import { 
  Store, 
  Groups, 
  VerifiedUser, 
  LocalShipping, 
  ThumbUp, 
  Favorite,
  Star,
  EmojiEvents
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <Store />,
      title: 'Our Story',
      description: 'Founded in 2023, we started with a simple mission: to bring quality products at fair prices to everyone.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      icon: <Groups />,
      title: 'Our Team',
      description: 'A passionate team of designers, developers, and customer service professionals working together.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      icon: <VerifiedUser />,
      title: 'Quality Promise',
      description: 'Every product is carefully selected and quality-checked before it reaches you.',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      icon: <LocalShipping />,
      title: 'Fast Delivery',
      description: 'We partner with reliable shipping carriers to ensure timely delivery across the globe.',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    }
  ];

  const values = [
    {
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We listen and adapt to your needs.',
      icon: <ThumbUp />
    },
    {
      title: 'Quality Products',
      description: 'We source only the best materials and work with trusted manufacturers.',
      icon: <Star />
    },
    {
      title: 'Fair Pricing',
      description: 'We believe in transparent pricing with no hidden costs.',
      icon: <VerifiedUser />
    },
    {
      title: 'Community Support',
      description: 'We give back to our community and support local initiatives.',
      icon: <Favorite />
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Countries Served' },
    { number: '24/7', label: 'Support Available' },
    { number: '100%', label: 'Satisfaction Guarantee' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Our Store
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're more than just a store - we're a community passionate about bringing you 
            the best products with exceptional service.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <div className="text-blue-600 dark:text-blue-400">
                        {value.icon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-16">
          <div className="flex items-center mb-6">
            <EmojiEvents className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Our Mission
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Our mission is simple: to provide exceptional products that enhance your daily life, 
            backed by outstanding customer service. We believe in building lasting relationships 
            with our customers, not just making one-time sales. Every product we offer is carefully 
            selected to ensure it meets our high standards of quality, functionality, and value.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
            We're committed to making shopping with us a seamless, enjoyable experience from 
            browsing to delivery. Thank you for choosing us - we're honored to serve you.
          </p>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Meet Our Leadership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Alex Johnson', role: 'Founder & CEO', desc: '10+ years in e-commerce' },
              { name: 'Sarah Miller', role: 'Head of Operations', desc: 'Expert in logistics' },
              { name: 'Michael Chen', role: 'Customer Experience', desc: 'Passionate about service' }
            ].map((person, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {person.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {person.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {person.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {person.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Be part of our journey. Follow us for updates, new arrivals, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Shop Now
              </button>
              <button className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                Contact Us
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;