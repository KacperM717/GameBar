import "./util/secrets";
import app from "./app";


if(process.env.ENV_MODE === "dev") {
    console.log("In development mode");
}

const server = app.listen(app.get("port"), () => {
    console.log(`App is running on port ${app.get("port")}`);
});

export default server;