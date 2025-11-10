import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";

export const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ taskId })
      .populate("taskId", "title description") 
      .sort({ createdAt: -1 });

    if (!comments.length)
      return res.status(404).json({ message: "No comments found for this task" });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};
