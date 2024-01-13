const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// const database = process.env.DATABASE;
const localDatabase = process.env.LOCAL_DATABASE;
mongoose
	.connect(localDatabase)
	// .connect(database)
	.then(() => console.log("Database connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	// console.log(process.env.NODE_ENV);
	console.log(`App running on port ${port}...`);
});
