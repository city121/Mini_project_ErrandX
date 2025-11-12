import Task from "../models/task.model.js";
import mongoose from "mongoose";

const populateTask = async (task) => {
  if (!task) return null;
  return task.populate("claimedBy", "name profilePic");
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("claimedBy", "name profilePic");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

export const getTask = async (req, res) => {
  try {
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
    res.status(201).json(createdTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.status === 'completed' && 
        updateData.status && 
        (updateData.status === 'pending' || updateData.status === 'in-progress')) {
        
        return res.status(400).json({ 
            message: "Cannot change the status of a completed task back to pending or in-progress." 
        });
    }

    // The problematic logic (updateData.claimedBy = null) has been removed from here.

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    }).populate("claimedBy", "name profilePic");

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      return res.status(400).json({ message: "Invalid Task ID format" });
    console.error(err);
    res.status(500).json({ message: "Server error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

export const claimTask = async (req, res) => {
  try {
    const userId = req.user._id; 
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    
    if (task.claimedBy) {
      if (task.claimedBy.toString() === userId.toString()) {
        return res.status(400).json({ message: "You have already claimed this task" });
      }
      return res.status(400).json({ message: "Task already claimed by another user" }); 
    }
    
    if (task.status !== 'pending') {
        return res.status(400).json({ message: `Cannot claim: Task status is '${task.status}'. Only 'pending' tasks can be claimed.` });
    }

    task.claimedBy = userId;
    task.status = "in-progress";
    const updatedTask = await task.save();
    
    const populatedTask = await populateTask(updatedTask);
    res.json(populatedTask);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
        return res.status(400).json({ message: "Invalid Task ID format" });
    console.error(err);
    res.status(500).json({ message: "Server error claiming task" });
  }
};

export const unclaimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.claimedBy) return res.status(400).json({ message: "Task is not currently claimed" });

    if (task.claimedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the claimant can unclaim this task" });
    }

    task.claimedBy = null;
    task.status = "pending";
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
        return res.status(400).json({ message: "Invalid Task ID format" });
    console.error(err);
    res.status(500).json({ message: "Server error unclaiming task" });
  }
};