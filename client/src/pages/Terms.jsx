import React from 'react';
import Navbar from '../components/Navbar.jsx'; 
import { Scale } from 'lucide-react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                    <Scale className="w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
                    Terms of Service
                </h1>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-gray-700 dark:text-gray-300 space-y-6">
                    <p className="font-semibold text-lg">Last Updated: November 2025</p>

                    <p>Welcome to ErrandX! These Terms of Service ("Terms") govern your access to and use of the ErrandX platform, including any content, functionality, and services offered on or through ErrandX (the "Service").</p>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">1. Acceptance of Terms</h2>
                    <p>By using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.</p>

                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-2">2. User Responsibilities</h2>
                    <p>Users must be affiliated with the campus community (e.g., current student, faculty, or staff) to post or claim tasks. You are responsible for the accuracy of your profile information and the legitimacy of tasks posted.</p>
                </div>
            </main>
        </div>
    );
}