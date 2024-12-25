import { DataTypes , Model } from "sequelize";
import { sequelize } from "../connection.js";
class Comment extends Model {}
Comment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Posts', 
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', 
            key: 'id',
        },
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
}, {
    sequelize,
    modelName: 'Comment',
    timestamps: true,
});

export default Comment