import { useState, useEffect, useCallback, useRef } from "react";
import { Camera, Pencil, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
// Assuming you have uploadProfilePictureApi for file upload
import { fetchTasks, uploadProfilePictureApi, updateUserApi } from "../api/api.js";
import toast from "react-hot-toast";

// Helper function to calculate task metrics (kept from original)
const calculateTaskMetrics = (tasks, userId) => {
  if (!tasks || !userId) {
    return { totalRewards: 0, remaining: [], remainingCount: 0 };
  }
  
  const claimedTasks = tasks.filter((t) => t.claimedBy?._id === userId);
  
  const totalRewards = claimedTasks
    .filter((t) => t.status === "completed") 
    .reduce((sum, t) => sum + (t.reward || 0), 0);
    
  const remaining = claimedTasks.filter((t) => t.status !== "completed");

  return { totalRewards, remaining, remainingCount: remaining.length };
};


export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isSaving, setIsSaving] = useState(false); 
  const [saveError, setSaveError] = useState(null); 
  
  // Local state for profile data
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // State for managing the actual file and its preview URL
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePic || "/default-profile.png");
  const [profilePicFile, setProfilePicFile] = useState(null); // CRITICAL: Holds the actual File object
  
  // Ref for the file input to trigger click programmatically
  const fileInputRef = useRef(null);

  // Local state for statistics
  const [rewards, setRewards] = useState(0);
  const [tasksRemaining, setTasksRemaining] = useState(0);
  const [remainingTasksList, setRemainingTasksList] = useState([]);
  const [showTasksModal, setShowTasksModal] = useState(false);


  // Effect 1: Fetch and calculate task metrics
  const loadTasks = useCallback(async () => {
    if (!user?._id) return;
    setLoadingTasks(true);
    try {
      const data = await fetchTasks();
      const { totalRewards, remaining, remainingCount } = calculateTaskMetrics(data, user._id);
      setRewards(totalRewards);
      setTasksRemaining(remainingCount);
      setRemainingTasksList(remaining);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoadingTasks(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Effect 2: Synchronize local state with global user object changes
  useEffect(() => {
    if (user) {
      // Sync URL from global state
      setProfilePicUrl(user.profilePic || "/default-profile.png");
      setName(user.name || "");
      setEmail(user.email || "");
    }
    // Also reset the file object since the UI is synced to the new URL
    setProfilePicFile(null);
    setSaveError(null); 
  }, [user]); 

  // CRITICAL FIX: Handle file selection and preview
  const handlePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file); // Store the actual file
      setProfilePicUrl(URL.createObjectURL(file)); // Set the preview URL
    }
  };

  // CRITICAL FIX: Upload the picture file first, get the URL, then update profile
  const handleSave = async (e) => { 
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);
    
    let newProfilePicUrl = user.profilePic; // Start with the existing URL

    try {
      // 1. Check if a new file has been selected (profilePicFile is not null)
      if (profilePicFile) {
        const formData = new FormData();
        // The key 'profilePic' must match what your backend expects from multer
        formData.append('profilePic', profilePicFile); 

        // AWAIT the file upload API call
        // The upload API must return the final public URL
        const uploadRes = await uploadProfilePictureApi(user._id, formData); 
        
        // Assuming the response data contains the new URL directly
        // Adjust uploadRes.data.url based on your actual API response structure
        newProfilePicUrl = uploadRes.data.profilePic || uploadRes.data.url; 
        toast.success("Photo uploaded successfully!");
      }

      // 2. Prepare data for the general profile update
      const updatedUserPayload = { 
        _id: user._id, 
        name, 
        email, 
        // Pass the new URL (or the old one if no file was uploaded)
        profilePic: newProfilePicUrl 
      };
      
      // 3. AWAIT the global profile update (updates name/email/URL in context)
      // This updateUser function should call the backend (updateUserApi) to persist the data.
      await updateUser(updatedUserPayload); 

      // Success actions
      setEditMode(false);
      setProfilePicFile(null); // Clear the file object after successful save
      toast.success("Profile updated successfully!");

    } catch (error) {
      // The error can come from the upload API or the updateUser API
      console.error("Profile save failed:", error);
      setSaveError(error.message || "Failed to save profile. Check your network or try again.");
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 flex flex-col items-center gap-6 relative transition-colors duration-300">
        
        {/* Profile Picture */}
        <div className="relative w-36 h-36 sm:w-48 sm:h-48 group">
          <img
            src={profilePicUrl} // CRITICAL: Use the local preview/saved URL
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-green-500 shadow-lg"
          />
          {editMode && (
            <label 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full cursor-pointer opacity-100 transition-opacity duration-200 transform hover:scale-105"
            >
              <Camera className="w-6 h-6" />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePicChange} 
                ref={fileInputRef} // Ref to hide and click programmatically
              />
            </label>
          )}
        </div>

        {/* Edit Toggle Button */}
        <button
          onClick={() => {
            if (editMode) {
              // Reset local state if canceling edit
              setProfilePicUrl(user.profilePic || "/default-profile.png");
              setName(user.name || "");
              setEmail(user.email || "");
              setProfilePicFile(null); // Clear pending file
              setSaveError(null);
            }
            setEditMode(!editMode);
          }}
          className="absolute top-6 right-6 p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 shadow-md"
        >
          {editMode ? <X className="w-6 h-6 text-red-500" /> : <Pencil className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
        </button>

        {/* Display Mode / Edit Form */}
        {!editMode ? (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">{name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{email}</p>
            
            <div className="flex flex-wrap justify-center gap-6 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg w-full">
              {loadingTasks ? (
                <p className="text-gray-500 dark:text-gray-400">Loading statistics...</p>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{rewards}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">💰 Total Rewards</p>
                  </div>
                  <div 
                    onClick={() => tasksRemaining > 0 && setShowTasksModal(true)}
                    className={`text-center p-2 rounded-lg transition-colors ${tasksRemaining > 0 ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
                  >
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{tasksRemaining}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">📋 Tasks Remaining</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-5 w-full max-w-lg mt-4" onSubmit={handleSave}>
            {/* Display Save Error */}
            {saveError && (
              <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-xl text-center font-medium">
                {saveError}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="mt-4 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>) : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Modal for remaining tasks (kept from original) */}
        {showTasksModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 relative transform scale-100 transition-transform">
              <button
                onClick={() => setShowTasksModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <h3 className="text-2xl font-bold mb-5 dark:text-white border-b pb-2 dark:border-gray-700">📋 Remaining Tasks ({remainingTasksList.length})</h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {remainingTasksList.length === 0 ? (
                  <p className="text-lg text-green-500 dark:text-green-400 text-center py-4">
                    All clear! No tasks remaining 🎉
                  </p>
                ) : (
                  remainingTasksList.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl flex justify-between items-center bg-white dark:bg-gray-700 transition-all hover:shadow-sm"
                    >
                      <span className="dark:text-white font-medium truncate pr-2">{task.title}</span>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                          💰 {task.reward}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                            ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                                 task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                              }`}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}