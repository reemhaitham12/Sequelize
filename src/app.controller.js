import { checkDBconnection , syncDBconnection } from "./DB/connection.js";
import User from "./DB/model/User.model.js";
import Post from "./DB/model/post.model.js";
import Comment from "./DB/model/comment.model.js";
// import authConnection from "./module/auth/auth.controller.js"
import userConnection from "./modules/user/user.controller.js"
import postConnection from "./modules/post/post.controller.js"
const bootstrap=(app,express)=>{
    app.use(express.json()); //convert buffer data
    // app-routing
    app.get('/', (req, res) => res.json({message:'Hello World!'}));
    // sub routing
    app.use("/user",userConnection)
    app.use("/post",postConnection)
    // in state error
    app.all("*",(req,res,next)=>{
        return res.status(404).json({message:"in-valid routing"})
    })
    // DB
    checkDBconnection();
    syncDBconnection();

}
export default bootstrap