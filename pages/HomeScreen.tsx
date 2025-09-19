
import React, { useState, useEffect } from 'react';
import { Card, StarRating } from '../components/ui';
import HomeHeader from '../components/HomeHeader';

const mockFeedback = [
  {
    id: 1,
    name: 'Alex Johnson',
    rating: 5,
    text: 'This platform is amazing! So easy to find and rate my favorite stores. The interface is clean and intuitive. Highly recommended!',
  },
  {
    id: 2,
    name: 'Samantha Bee',
    rating: 4,
    text: 'A really useful tool for checking out new places. I love being able to see what other people think before I visit a store.',
  },
  {
    id: 3,
    name: 'Michael Chen',
    rating: 5,
    text: 'As a store owner, this has been invaluable for getting feedback directly from my customers. It has helped us improve our service significantly.',
  },
  {
    id: 4,
    name: 'Jessica Miller',
    rating: 5,
    text: "I use this app all the time. It's my go-to for discovering hidden gems in my city. The user ratings are always spot on.",
  },
];

const FeedbackCard: React.FC<{ feedback: typeof mockFeedback[0] }> = ({ feedback }) => (
  <Card className="flex flex-col justify-center items-center text-center p-8 h-full bg-white shadow-lg rounded-2xl border border-gray-100">
    <StarRating count={5} value={feedback.rating} />
    <p className="mt-4 text-gray-700 italic leading-relaxed">"{feedback.text}"</p>
    <p className="mt-4 font-semibold text-indigo-700">- {feedback.name}</p>
  </Card>
);

const HomeScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockFeedback.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50">
      <HomeHeader />
      {/* Hero Section */}
      <section className="relative text-center pt-32 pb-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-b-[3rem] shadow-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Discover & Rate Your Favorite Stores
        </h1>
        <p className="mt-6 text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Join thousands of users sharing their experiences and helping local businesses grow.
        </p>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-20">
        {/* About Us Section */}
        <section id="about-us" className="text-center">
          <div className="bg-white shadow-xl rounded-2xl p-10 max-w-4xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Welcome to Store Ratings</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your one-stop destination for discovering, rating, and reviewing local stores. 
              Whether you're a customer looking for the best spots in town or a store owner wanting 
              to connect with your community, our platform provides the tools you need to share 
              and gather valuable feedback.
            </p>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="feedback" className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-12">✨ What Our Users Say</h2>
          <div className="relative h-72 max-w-2xl mx-auto">
            {mockFeedback.map((feedback, index) => (
              <div
                key={feedback.id}
                className="absolute w-full h-full transition-opacity duration-1000 ease-in-out"
                style={{ opacity: index === currentSlide ? 1 : 0 }}
              >
                <FeedbackCard feedback={feedback} />
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8">
            {mockFeedback.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-2 rounded-full transition-colors duration-300 ${
                  currentSlide === index ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-indigo-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;
