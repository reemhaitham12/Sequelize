import Comment from "../../DB/model/comment.model.js";
import { Op } from "sequelize";
// 1.URL: POST /comments
export const bulk = async (req, res) => {
  const commentsData = req.body;
  try {
    if (!Array.isArray(commentsData)) {
      return res
        .status(400)
        .json({ error: "Input should be an array of comment objects" });
    }
    const createdComments = await Comment.bulkCreate(commentsData, {
      validate: true,
    });

    return res.status(201).json({
      message: "Comments created ",
      data: createdComments,
    });
  } catch (error) {
    console.error("Error creating comments:", error);
    return res.status(500).json({
      error: "An error occurred while creating comments",
      details: error.message,
    });
  }
};

// 2.o URL: PATCH /comments/:commentId
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }
    comment.content = content;
    await comment.save();
    return res
      .status(200)
      .json({ message: "Comment updated successfully", data: comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//   3.o URL: POST /comments/find-or-create
export const findOrCreateComment = async (req, res) => {
  const { postId, userId, content } = req.body;
  try {
    if (!postId || !userId || !content) {
      return res
        .status(400)
        .json({ error: "postId, userId, and content are required" });
    }
    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content },
    });
    if (created) {
      return res
        .status(201)
        .json({ message: "Comment created successfully", data: comment });
    }
    return res
      .status(200)
      .json({ message: "Comment already exists", data: comment });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 4.o URL: GET /comments/search => (for example /comments/search?word=the)
export const searchComments = async (req, res) => {
    const { word } = req.query; 
    try {
      if (!word) {
        return res.status(400).json({ error: 'A search word is required' });
      }
      const { rows: comments, count } = await Comment.findAndCountAll({
        where: {
          content: {
            [Op.like]: `%${word}%`, 
          },
        },
        attributes: ['id', 'content'], 
      });
      return res.status(200).json({
        message: `Found ${count} comments containing the word "${word}"`,
        data: comments,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

// 5.URL: GET /comments/newest/:postId
export const getNewestComments = async (req, res) => {
    const { postId } = req.params; 
    try {
      if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      const comments = await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'DESC']], 
        limit: 3,
        attributes: ['id', 'content', 'createdAt'], 
      });
      return res.status(200).json({
        message: `3 most recent comments for post ${postId}`,
        data: comments,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };



// 6.o URL: GET /comments/details/:id
export const getCommentDetails = async (req, res) => {
    const { id } = req.params; 
    try {
      const comment = await Comment.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ['id', 'name'], 
          },
          {
            model: Post,
            attributes: ['id', 'title'], 
          },
        ],
        attributes: ['id', 'content', 'createdAt', 'updatedAt'], 
      });
  
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      return res.status(200).json({
        message: `Details for comment ${id}`,
        data: comment,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };