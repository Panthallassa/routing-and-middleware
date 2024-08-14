const express = require("express");
const app = express();
const itemRoutes = require("./routes/items");

app.use(express.json());

app.use("/items", itemRoutes);

// 404 handler
app.use((req, res, next) => {
	const e = new Error("Not found");
	e.status = 404;
	next(e);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	return res.json({ error: err.message });
});

module.exports = app;
