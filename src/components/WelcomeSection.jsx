import React from 'react';
import { Heart, Users, Church, BookOpen, Star, ArrowRight } from 'lucide-react';

const WelcomeSection = () => {
  const welcomeFeatures = [
    {
      icon: Heart,
      title: 'Faith Community',
      description: 'Join our loving parish family in worship and fellowship'
    },
    {
      icon: Church,
      title: 'Sacred Worship',
      description: 'Experience the beauty of Catholic liturgy and traditions'
    },
    {
      icon: Users,
      title: 'Active Societies',
      description: 'Engage with various ministries and parish organizations'
    },
    {
      icon: BookOpen,
      title: 'Spiritual Growth',
      description: 'Deepen your faith through learning and prayer'
    }
  ];

  const testimonials = [
    {
      name: 'Mrs. Adebayo',
      role: 'Parishioner since 2015',
      quote: 'St. Francis has been our spiritual home. The warmth and fellowship here is extraordinary.',
      rating: 5
    },
    {
      name: 'Mr. Chukwu',
      role: 'Youth Leader',
      quote: 'The youth programs have helped shape my faith and leadership skills tremendously.',
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Welcome Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Welcome to 
                <span className="text-red-600 block mt-2">St. Francis Catholic Church</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We are a vibrant Catholic community in Oregun, Lagos, dedicated to worship, 
                fellowship, and serving God through love and action. Whether you're a lifelong 
                Catholic or exploring faith for the first time, you'll find a warm welcome here.
              </p>
            </div>

            {/* Mission Statement Box */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To be a Christ-centered community that welcomes all people, celebrates the 
                Eucharist, grows in faith, and serves others with love and compassion in 
                the spirit of St. Francis of Assisi.
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center">
                Visit Us This Sunday
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all">
                Learn More About Us
              </button>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Church className="w-24 h-24 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">House of God</h3>
                <p className="text-gray-600">A place of worship, prayer, and community</p>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">25+</div>
                <div className="text-sm text-gray-600">Years Serving</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Families</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Parish?</h3>
            <p className="text-xl text-gray-600">Discover what makes St. Francis special</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {welcomeFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 group-hover:bg-red-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-red-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">What Our Parishioners Say</h3>
            <p className="text-xl text-gray-600">Hear from our community members</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                {/* Star Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-600 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Join Our Family?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Take the first step in your spiritual journey with us. We're here to support 
              and guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Plan Your Visit
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
                Contact Pastor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;