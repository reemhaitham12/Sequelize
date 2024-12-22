import {Sequelize} from "sequelize"
export const sequelize = new Sequelize('assign8','root','',{
    host:'127.0.0.1',
    port:"3306",
    dialect:'mysql',
    // logging: console.log
});

export const checkDBconnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

export const syncDBconnection = async () => {
    await sequelize.sync({ alter: false , force:false})
        .then((res) => {
            console.log("DB synced successfully");
        })
        .catch((err) => {
            console.error("Failed to sync database:", err);
        });
};
