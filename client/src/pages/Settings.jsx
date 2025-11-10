import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx'; // Adjust path as needed
import { useAuth } from '../context/AuthContext.jsx'; 
import { User, Key, Mail, CreditCard } from 'lucide-react';

export default function Settings() {
    const { user } = useAuth(); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        console.log('Updating password for:', user.email);
        setTimeout(() => {
            setSuccess('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
                    <User className="inline-block w-8 h-8 mr-3 text-green-600 dark:text-green-400" />
                    Account Settings
                </h1>

                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 space-y-10">

                    {/* User Information */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-green-500" />
                            User Details
                        </h2>
                        <div className="space-y-2 text-gray-700 dark:text-gray-300">
                            <p><strong>Name:</strong> {user?.name || 'Loading...'}</p>
                            <p><strong>Email:</strong> {user?.email || 'Loading...'}</p>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Change Password Form */}
                    <form onSubmit={handlePasswordUpdate}>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                            <Key className="w-5 h-5 mr-2 text-red-500" />
                            Change Password
                        </h2>
                        {error && <p className="text-red-500 mb-3">{error}</p>}
                        {success && <p className="text-green-500 mb-3">{success}</p>}

                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}