import {Router} from "express"
import { comment, details, postId, posts } from "./post.service.js";
const router =Router();
router.post('/posts',posts);
router.delete('/postId',postId);
router.get('/details',details);
router.get("/comment-count",comment);
export default router