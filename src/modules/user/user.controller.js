import {Router} from "express"
import { byEmail, id_User, signup, updateOrCreateUser } from "./user.service.js";
const router =Router();
router.post("/signup",signup);
router.put("/:id",updateOrCreateUser);
router.get("/by-email",byEmail);
router.get("/:id",id_User);
export default router