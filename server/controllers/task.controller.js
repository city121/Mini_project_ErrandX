import Task from "../models/task.model.js";
import mongoose from "mongoose";

// Helper to populate user details
const populateTask = (task) => task.populate("claimedBy", "name profilePic");

// --- READ ALL TASKS ---
export const getTasks = async (req, res) => {
  try {
    // Correctly populating profilePic here
    const tasks = await Task.find({}).populate("claimedBy", "name profilePic");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// --- READ SINGLE TASK ---
export const getTask = async (req, res) => {
  try {
    // Correctly populating profilePic here
    const task = await Task.findById(req.params.id).populate("claimedBy", "name profilePic");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      return res.status(400).json({ message: "Invalid Task ID format" });
    console.error(err);
    res.status(500).json({ message: "Server error fetching task" });
  }
};

// --- CREATE TASK ---
export const createTask = async (req, res) => {
  try {
    const { title, description, reward, dueDate } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Please include a title and description" });

    const task = new Task({
      title,
      description,
      reward: reward || 0,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    // NOTE: If you want the created task returned with the 'createdBy' populated, 
    // you should call populateTask(createdTask) before res.json().
    res.status(201).json(createdTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// --- UPDATE TASK ---
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Correctly populating profilePic here
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("claimedBy", "name profilePic");

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// --- DELETE TASK ---
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

// --- CLAIM TASK ---
export const claimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Already claimed by same user
    if (task.claimedBy && task.claimedBy.toString() === userId.toString()) {
      return res.status(400).json({ message: "You have already claimed this task" });
    }

    // Already claimed by another user
    if (task.claimedBy && task.claimedBy.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Task already claimed by another user" });
    }

    // Claim task
    task.claimedBy = userId;
    task.status = "in-progress";
    const updatedTask = await task.save();
    // Correctly populating profilePic here
    const populatedTask = await populateTask(updatedTask);
    res.json(populatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error claiming task" });
  }
};

// --- UNCLAIM TASK ---
export const unclaimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.claimedBy) return res.status(400).json({ message: "Task is not currently claimed" });

    // ❌ Only the person who claimed can unclaim
    if (task.claimedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the claimant can unclaim this task" });
    }

    // Unclaim task
    task.claimedBy = null;
    task.status = "pending";
    const updatedTask = await task.save();
    // No need to populate unclaim since claimedBy is null, but we return the raw object
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error unclaiming task" });
  }
};