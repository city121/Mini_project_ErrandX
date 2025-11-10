import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  claimTask,
  unclaimTask,
} from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Base styling inspired by the image for task/service cards
const CARD_BASE_CLASSES =
  "bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-green-500/40 border-2 border-transparent hover:border-green-400/50 dark:hover:border-green-600/50";
const BUTTON_BASE_CLASSES =
  "px-4 py-2 rounded-xl text-white font-semibold transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900";
const INPUT_BASE_CLASSES =
  "p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-all duration-200 focus:border-green-500 dark:focus:border-green-500";

// Helper function to sort tasks (pending -> in-progress -> completed)
const sortTasks = (taskList) => {
  const order = { pending: 1, "in-progress": 2, completed: 3 };
  return [...taskList].sort(
    (a, b) => (order[a.status] || 4) - (order[b.status] || 4)
  );
};

// Helper function to get status badge classes
const getStatusClasses = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-white"; // Yellow for Pending
    case "in-progress":
      return "bg-blue-600 text-white"; // Blue for In Progress
    case "completed":
      return "bg-green-600 text-white"; // Green for Completed
    default:
      return "bg-gray-400 text-white"; // Default gray
  }
};

// --- Chatbot Component (MODIFIED for styling and list output) ---
function Chatbot({ tasks }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatbotRef = useRef(null);
  const timeoutRef = useRef(null);

  // Function to reset the inactivity timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (open) {
        setOpen(false);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 dark:bg-gray-800 p-3`}
            >
              <div className="flex-1 w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Chatbot closed due to inactivity.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Click '💬' to reopen.
                </p>
              </div>
            </div>
          ),
          { duration: 2000, position: "bottom-left" }
        );
      }
    }, 3000); // 3 seconds
  };

  // Effect to manage the timeout and event listeners when the chat is open
  useEffect(() => {
    if (open) {
      resetTimeout(); // Start the timer when opened
      const chatElement = chatbotRef.current;

      const listeners = ["mousemove", "click", "keydown"];
      listeners.forEach(event => chatElement.addEventListener(event, resetTimeout));

      // Cleanup function: remove listeners and clear timeout when the component unmounts or 'open' changes to false
      return () => {
        listeners.forEach(event => chatElement.removeEventListener(event, resetTimeout));
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // Clear timeout immediately if closed manually
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { user: "You", text: input };
    let botReply = {
      user: "Bot",
      text: "I don't understand. Try asking about tasks (e.g., 'show all tasks', 'show pending tasks').",
    };

    const query = input.toLowerCase();

    // Utility function for generating task list in bullet form
    const generateTaskList = (taskList) => {
      if (taskList.length === 0) return "No tasks found.";
      const listItems = taskList
        .map(
          (t) =>
            `• **${t.title}** [${t.status.toUpperCase()}]${
              t.dueDate
                ? " - Due: " + new Date(t.dueDate).toLocaleDateString()
                : ""
            }${t.claimedBy ? " (Claimed)" : ""}`
        );
        // Join with a newline to ensure separate lines
        return listItems.join("\n");
    };

    if (query.includes("show all tasks")) {
      botReply = { user: "Bot", text: "Here are all tasks:\n" + generateTaskList(tasks) };
    } else if (query.includes("show pending tasks")) {
      const pendingTasks = tasks.filter((t) => t.status === "pending");
      botReply = { user: "Bot", text: "Here are the pending tasks:\n" + generateTaskList(pendingTasks) };
    } else if (
      query.includes("show in-progress tasks") ||
      query.includes("show in progress tasks")
    ) {
      const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
      botReply = { user: "Bot", text: "Here are the tasks in progress:\n" + generateTaskList(inProgressTasks) };
    } else if (query.includes("show completed tasks")) {
      const completedTasks = tasks.filter((t) => t.status === "completed");
      botReply = { user: "Bot", text: "Here are the completed tasks:\n" + generateTaskList(completedTasks) };
    }

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
    resetTimeout(); // Reset timeout after sending a message
  };

  return (
    <div className="flex flex-col items-start" ref={chatbotRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-80 sm:w-96 h-96 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col p-4 space-y-3 overflow-hidden border border-green-500/50"
          >
            <div className="flex justify-between items-center pb-2 border-b border-green-500/30 dark:border-green-700/50">
              <h3 className="font-extrabold text-xl dark:text-white text-green-700">
                🤖 Task Bot Assistant
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 text-2xl font-bold transition-transform hover:scale-110"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 p-1 chat-scroll">
              {messages.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-10">
                  Hi! I can help you summarize your tasks. Try asking:
                  <br />
                  <span className="font-semibold italic">"Show all tasks"</span>
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  // Apply specific bubble styles
                  className={
                    m.user === "Bot"
                      ? "text-left text-gray-800 dark:text-gray-200 whitespace-pre-line bg-green-100 dark:bg-green-900/40 p-3 rounded-t-xl rounded-br-xl mr-8 shadow-sm text-sm"
                      : "text-right text-white whitespace-pre-line bg-green-600 dark:bg-green-700 p-3 rounded-t-xl rounded-bl-xl ml-8 shadow-md text-sm"
                  }
                >
                  <span className="font-bold">
                    {m.user === "Bot" ? "🤖 Bot" : "You"}:
                  </span>{" "}
                  {/* Render using dangerouslySetInnerHTML for markdown-like bold/newline parsing in the bot's response */}
                  <div 
                    className={m.user === "Bot" ? "mt-1 bot-list" : "mt-1"}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`${INPUT_BASE_CLASSES} flex-1 p-3`}
                placeholder="Ask me..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className={`${BUTTON_BASE_CLASSES} bg-green-600 hover:bg-green-700 shadow-green-600/50`}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating Action Button with pulse animation */}
      <motion.button
        onClick={() => {
          setOpen(!open);
          if (!open) resetTimeout();
        }}
        className="w-14 h-14 bg-green-600 rounded-full text-white text-2xl font-bold shadow-2xl hover:bg-green-700 transition-colors duration-300 relative z-40"
        whileTap={{ scale: 0.9 }}
        animate={!open ? { scale: [1, 1.1, 1], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } } : { scale: 1, transition: { duration: 0.1 } }}
      >
        {open ? <span className="text-lg font-mono">X</span> : "💬"}
      </motion.button>
    </div>
  );
}
// --- End Chatbot Component ---

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [desc, setDesc] = useState("");
  const [reward, setReward] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editReward, setEditReward] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Load tasks on mount and when user changes
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await fetchTasks();
        setTasks(sortTasks(data));
      } catch (err) {
        toast.error("Failed to fetch tasks 😢");
        console.error(err);
      }
    }
    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !desc.trim()) {
      toast.error("Enter title and description!");
      return;
    }
    try {
      const created = await createTask({
        title: newTask,
        description: desc,
        reward: Number(reward) || 0,
        dueDate: newDueDate || null,
      });
      setTasks((prevTasks) => sortTasks([...prevTasks, created]));
      toast.success("Task added 🎉");
      setNewTask("");
      setDesc("");
      setReward("");
      setNewDueDate("");
    } catch (err) {
      toast.error("Error creating task 😞");
      console.error(err);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditReward(task.reward);
    // Format ISO date string to YYYY-MM-DD for input type="date"
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editDesc.trim()) {
      toast.error("Title and description can't be empty!");
      return;
    }
    try {
      const updated = await updateTask(editingTask._id, {
        title: editTitle,
        description: editDesc,
        reward: Number(editReward) || 0,
        dueDate: editDueDate || null,
      });
      setTasks((prevTasks) =>
        sortTasks(prevTasks.map((t) => (t._id === updated._id ? updated : t)))
      );
      toast.success("Task updated ✏️");
      setEditingTask(null);
    } catch (err) {
      toast.error("Error updating task 😞");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => sortTasks(prevTasks.filter((t) => t._id !== id)));
      toast.success("Task deleted 🗑️");
    } catch (err) {
      toast.error("Error deleting task 😢");
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateTask(id, { status: newStatus });
      setTasks((prevTasks) =>
        sortTasks(prevTasks.map((t) => (t._id === id ? updated : t)))
      );
      toast.success(`Status changed to "${newStatus}" ✅`);
    } catch (err) {
      toast.error("Error updating status 😞");
      console.error(err);
    }
  };

  const handleClaim = async (taskId) => {
    if (!user || !user._id) {
      toast.error("Please log in to claim tasks.");
      return;
    }
    try {
      const res = await claimTask(taskId, user._id);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res : t)));
      toast.success(`Claimed by ${user.name}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to claim task");
    }
  };

  const handleUndoClaim = async (taskId) => {
    try {
      const res = await unclaimTask(taskId);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res : t)));
      toast.success("Claim undone");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to undo claim");
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <motion.div
      // Enhanced Background Styling: Subtle gradient
      className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Dark Mode Toggle / Action Dropdown (Placeholder for original right-side element) */}
      <div className="fixed top-6 right-6 z-50">{/* Placeholder */}</div>

      <h1 className="text-5xl font-extrabold text-green-700 dark:text-green-400 mb-10 tracking-tight drop-shadow-lg">
        Task Manager ⚡️
      </h1>

      {/* Add Task Form - Styled to be a prominent card */}
      <motion.form
        onSubmit={handleAddTask}
        className={`${CARD_BASE_CLASSES} flex flex-col gap-4 mb-10 w-full max-w-5xl p-8 border-green-300 dark:border-green-800`}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Create New Task</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task title..."
            className={`col-span-1 ${INPUT_BASE_CLASSES}`}
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Task description..."
            className={`col-span-1 lg:col-span-1 ${INPUT_BASE_CLASSES}`}
          />
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="Reward (₹)"
            className={`col-span-1 ${INPUT_BASE_CLASSES}`}
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className={`col-span-1 ${INPUT_BASE_CLASSES}`}
          />
        </div>
        <button
          type="submit"
          className={`${BUTTON_BASE_CLASSES} bg-green-600 hover:bg-green-700 w-full mt-2 shadow-green-600/50`}
        >
          Add New Task
        </button>
      </motion.form>

      {/* Filter Bar and Progress Bar container */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-5xl mb-8 gap-6">
        {/* Progress Bar (Styled as a card) */}
        {tasks.length > 0 && (
          <motion.div
            className={`${CARD_BASE_CLASSES} flex-1 p-4 w-full border-blue-300 dark:border-blue-800`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-xl">
              Overall Progress: {Math.round(progress)}%
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                className="h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
                style={{
                  background: `linear-gradient(90deg, #10B981, #059669)`,
                }} // Emerald to Green
              />
            </div>
          </motion.div>
        )}

        {/* Filter Dropdown */}
        <div className="flex-shrink-0 w-full sm:w-56">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full ${INPUT_BASE_CLASSES} px-4 py-3 shadow-md`}
          >
            <option value="all">View All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <ul className="w-full max-w-5xl space-y-8 mb-20">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.p
              key="no-tasks"
              className="text-gray-500 dark:text-gray-400 text-center text-2xl mt-12 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No tasks found in the "{filter}" category. Start a new one!
            </motion.p>
          ) : (
            filteredTasks.map((task) => (
              <motion.li
                key={task._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className={`${CARD_BASE_CLASSES} flex flex-col justify-between items-start gap-5`}
              >
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="text-3xl font-extrabold mb-1 dark:text-white text-green-700">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-base italic border-l-4 border-yellow-500 pl-3">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <p className="font-extrabold text-xl text-yellow-600 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/40 p-1 rounded-lg">
                      💰 Reward: ₹{task.reward}
                    </p>
                    {task.dueDate && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-bold flex items-center gap-1">
                        <span className="text-lg">🗓️</span> Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {task.claimedBy && (
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1">
                            {/* START: PROFILE PIC LOGIC */}
                        {task.claimedBy.profilePic ? (
                          <img 
                            src={task.claimedBy.profilePic} 
                            alt={`${task.claimedBy.name}'s Profile`}
                            className="w-6 h-6 rounded-full object-cover mr-1"
                          />
                        ) : (
                          <span className="text-lg">🧑‍💻</span>
                        )}
                            {/* END: PROFILE PIC LOGIC */}
                        Claimed by:{" "}
                        {task.claimedBy.name || 'User'}
                      </p>
                    )}
                    <span
                      className={`inline-block px-5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg ${getStatusClasses(
                        task.status
                      )}`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </div>

                  {/* Button Group */}
                  <div className="flex flex-col sm:flex-row gap-4 w-full border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                    <button
                      onClick={() =>
                        task.claimedBy
                          ? handleUndoClaim(task._id)
                          : handleClaim(task._id)
                      }
                      className={`${BUTTON_BASE_CLASSES} ${
                        task.claimedBy
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/50"
                      } flex-1 whitespace-nowrap`}
                    >
                      {task.claimedBy ? "Undo Claim" : "Claim Task"}
                    </button>

                    <select
                      value={task.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className={`${INPUT_BASE_CLASSES} px-4 py-2 text-sm flex-1 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => openEditModal(task)}
                      className={`${BUTTON_BASE_CLASSES} bg-yellow-500 hover:bg-yellow-600 flex-1 shadow-yellow-500/50`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className={`${BUTTON_BASE_CLASSES} bg-red-500 hover:bg-red-600 flex-1 shadow-red-500/50`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>

      {/* Edit Modal (unchanged styling) */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md flex flex-col gap-4 shadow-2xl border border-green-500/50"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <h2 className="text-3xl font-bold dark:text-white text-green-600">
                Edit Task
              </h2>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`${INPUT_BASE_CLASSES}`}
                placeholder="Title"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className={`${INPUT_BASE_CLASSES} min-h-[100px]`}
                placeholder="Description"
              />
              <input
                type="number"
                value={editReward}
                onChange={(e) => setEditReward(e.target.value)}
                className={`${INPUT_BASE_CLASSES}`}
                placeholder="Reward"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className={`${INPUT_BASE_CLASSES}`}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={saveEdit}
                  className={`${BUTTON_BASE_CLASSES} bg-green-600 hover:bg-green-700 flex-1 shadow-green-600/50`}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className={`${BUTTON_BASE_CLASSES} bg-gray-500 hover:bg-gray-600 flex-1`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Floating Button (POSITIONED TO BOTTOM-LEFT) */}
      <div className="fixed bottom-6 left-6 z-50">
        <Chatbot tasks={tasks} />
      </div>
    </motion.div>
  );
}