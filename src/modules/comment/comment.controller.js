import {Router} from "express"
const router =Router();
import { bulk ,updateComment,findOrCreateComment,searchComments,getNewestComments ,getCommentDetails} from "./comment.service.js"
router.post("/",bulk);
router.patch("/:commentId",updateComment);
router.post("/find-or-create",findOrCreateComment);
router.get("/search",searchComments);
router.get("/newest/:postId",getNewestComments)
router.get("/details/:id",getCommentDetails);
export default router