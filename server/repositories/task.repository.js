// src/repositories/task.repository.js
import Task from "../models/task.model.js";

export const findAll = () => Task.find().sort({ createdAt: -1 });

export const findById = (id) => Task.findById(id);

export const createOne = (taskData) => Task.create(taskData);

export const updateById = (id, updates) =>
  Task.findByIdAndUpdate(id, updates, { new: true });

export const deleteById = (id) => Task.findByIdAndDelete(id);
