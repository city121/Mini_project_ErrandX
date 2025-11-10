import { Link } from "react-router-dom";
import { Users, Coins, Zap, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          About ErrandX 🌿
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The microtask platform built specifically for campus communities.
        </p>
      </header>

      <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition-colors duration-500 border border-gray-200 dark:border-gray-700">
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          Our Mission
        </h2>
        
        <div className="space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            ErrandX was founded on a simple premise: **empowering peer help and productivity through small tasks and rewards.** We connect students on campus who need minor help with those who are ready to earn quick rewards.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Whether it's moving a box, proofreading a paper, or fetching coffee, we make transactions lightweight, fast, and entirely built for college life.
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-10 mb-6 pt-6 border-t border-dashed border-gray-300 dark:border-gray-600">
          Why ErrandX?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard 
            icon={<MapPin className="w-8 h-8 text-green-500" />}
            title="Campus-Centric"
            description="Designed exclusively for college environments, ensuring all tasks and interactions are local, trusted, and efficient."
          />
          <FeatureCard 
            icon={<Coins className="w-8 h-8 text-yellow-500" />}
            title="Instant Rewards"
            description="Earn rewards instantly upon task completion. No complex payment systems—just quick, reliable transactions."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="Peer-to-Peer Focus"
            description="Foster stronger community bonds by helping fellow students succeed and reducing campus friction."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-red-500" />}
            title="Lightweight & Fast"
            description="Post tasks in seconds and find helpers in minutes. Our platform is optimized for speed and minimal overhead."
          />
        </div>
      </section>

      <div className="text-center mt-12">
        <Link
          to="/tasks"
          className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
        >
          Explore Tasks Now
        </Link>
      </div>
    </div>
  );
}

// Simple component for better readability
function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-inner transition-colors duration-300">
      <div className="pt-1">{icon}</div>
      <div>
        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
        <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}