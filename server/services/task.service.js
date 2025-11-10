// src/services/task.service.js
import * as repo from "../repositories/task.repository.js";

export const getTasks = async () => {
  return await repo.findAll();
};

export const getTaskById = async (id) => {
  const task = await repo.findById(id);
  if (!task) throw new Error("Task not found");
  return task;
};

export const createTask = async (taskData) => {
  // you can add validations / default logic here
  if (!taskData.title || !taskData.description) {
    const err = new Error("Title and description are required");
    err.status = 400;
    throw err;
  }
  return await repo.createOne(taskData);
};

export const updateTask = async (id, updates) => {
  const updated = await repo.updateById(id, updates);
  if (!updated) throw new Error("Task not found or update failed");
  return updated;
};

export const deleteTask = async (id) => {
  const deleted = await repo.deleteById(id);
  if (!deleted) throw new Error("Task not found or delete failed");
  return deleted;
};
