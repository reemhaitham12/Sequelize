import Post from "../../DB/model/post.model.js";
// 1.o URL: POST /posts
export const posts = async (req, res, next) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ error: "Title, content, and userId are required" });
  }

  try {
    const newPost = await Post.create({
      title,
      content,
      userId,
    });
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating new post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

// 2.URL: DELETE /posts/:postId
export const postId=async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (post.userId !== userId) {
        return res.status(403).json({ error: 'You are not authorized to delete this post' });
      }
      await post.destroy();
      return res.status(200).json({ message: 'Post deleted ' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'An error occurred while deleting the post' });
    }
  }

//   3.URL: GET /posts/details

export const details=async (req, res,next) => {
    try {
      const posts = await Post.findAll({
        attributes: ['id', 'title'], 
        include: [
          {
            model: User,
            attributes: ['id', 'name'],
          },
          {
            model: Comment,
            attributes: ['id', 'content'], 
            include: [
              {
                model: User,
                attributes: ['id', 'name'], 
              }
            ]
          }
        ]
      });
    return res.status(200).json(posts);
    } catch (error) {
      console.error('Error retrieving posts with details:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving posts' });
    }
  }

export const comment=async (req, res) => {
    try {
      const posts = await Post.findAll({
        attributes: ['id', 'title'], 
        include: [
          {
            model: Comment,
            attributes: [], 
            duplicating: false, 
          }
        ],
        group: ['Post.id'], 
        having: Sequelize.literal('COUNT(Comment.id) >= 0'), 
        raw: true 
      });
  
      const postsWithCommentCount = posts.map(post => ({
        ...post,
        commentCount: post['Comments.count'] 
      }));
  
      return res.status(200).json(postsWithCommentCount);
    } catch (error) {
      console.error('Error retrieving posts with comment count:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving posts' });
    }
  }