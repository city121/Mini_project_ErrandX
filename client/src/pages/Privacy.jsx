import React from 'react';
import Navbar from '../components/Navbar.jsx'; 
import { Lock } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                    <Lock className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
                    Privacy Policy
                </h1>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-gray-700 dark:text-gray-300 space-y-6">
                    <p className="font-semibold text-lg">Effective Date: November 2025</p>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as your name, campus email address, and profile picture upon registration. We also collect transaction data related to tasks posted and rewards paid.</p>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">2. How We Use Your Information</h2>
                    <p>We use the information we collect to operate, maintain, and provide you with all the features of the Service, including facilitating task matching, processing rewards, and sending you service-related notices.</p>
                </div>
            </main>
        </div>
    );
}