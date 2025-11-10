import { motion } from "framer-motion";

export default function UserProfileModal({ profileData, onClose }) {
  const { username, claimedCount, completedCount, totalReward } = profileData;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-300 dark:border-gray-700"
        initial={{ scale: 0.8, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
          {username}'s Profile
        </h2>

        <div className="space-y-4">
          <ProfileStat 
            label="Tasks Claimed" 
            value={claimedCount} 
            icon="🎯" 
            bgColor="bg-blue-100 dark:bg-blue-900/40"
            textColor="text-blue-700 dark:text-blue-300"
          />
          <ProfileStat 
            label="Tasks Completed" 
            value={completedCount} 
            icon="✅" 
            bgColor="bg-green-100 dark:bg-green-900/40"
            textColor="text-green-700 dark:text-green-300"
          />
          <ProfileStat 
            label="Total Reward Earned" 
            value={`₹${totalReward}`} 
            icon="💰" 
            bgColor="bg-yellow-100 dark:bg-yellow-900/40"
            textColor="text-yellow-700 dark:text-yellow-300"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

const ProfileStat = ({ label, value, icon, bgColor, textColor }) => (
  <div className={`p-4 rounded-lg flex items-center justify-between ${bgColor}`}>
    <div className="flex items-center">
      <span className="text-xl mr-3">{icon}</span>
      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{label}</p>
    </div>
    <span className={`text-xl font-bold ${textColor}`}>{value}</span>
  </div>
);