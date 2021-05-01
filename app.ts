import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index";

const app = express();

mongoose.connect('mongodb://localhost/library');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.urlencoded());
app.use(express.json());

app.use(routes);

app.listen(4000, () => {
    console.log(`Server started on port 4000`);
});

export default app;