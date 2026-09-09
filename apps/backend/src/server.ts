import app from "./app";
import { AppDataSource } from "./config/database";


AppDataSource.initialize()
    .then(() => {

        app.listen(3000, () => {
            console.log("API running on port 3000");
        });

    })
    .catch((error) => {
        console.error(error);
    });