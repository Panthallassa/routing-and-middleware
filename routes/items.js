const express = require("express");
const router = new express.Router();
const items = require("../fakeDb");

// Get items
router.get("/", (req, res, next) => {
	try {
		res.json({ items });
	} catch (e) {
		next(e);
	}
});

// Post items
router.post("/", (req, res, next) => {
	try {
		const { name, price } = req.body;

		if (!name || !price) {
			return res
				.status(400)
				.json({ error: "Name and price are required" });
		}
		const newItem = { name, price };
		items.push(newItem);
		return res.status(201).json({ added: newItem });
	} catch (e) {
		next(e);
	}
});

// Get a single item by name
router.get("/:name", (req, res, next) => {
	try {
		const item = items.find(
			(i) => i.name === req.params.name
		);
		if (!item)
			return res
				.status(404)
				.json({ error: "Item not found" });

		res.json(item);
	} catch (e) {
		next(e);
	}
});

// patch single items data
router.patch("/:name", (req, res, next) => {
	try {
		const item = items.find(
			(i) => i.name === req.params.name
		);
		if (!item)
			return res
				.status(404)
				.json({ error: "Item not found" });

		const { name, price } = req.body;
		if (name) item.name = name;
		if (price) item.price = price;

		res.json({ updated: item });
	} catch (e) {
		next(e);
	}
});

// delete an item:
router.delete("/:name", (req, res, next) => {
	try {
		const itemIndex = items.findIndex(
			(i) => i.name === req.params.name
		);
		if (itemIndex === -1)
			return res
				.status(404)
				.json({ error: "Item not found" });

		items.splice(itemIndex, 1);
		res.json({ message: "Deleted" });
	} catch (e) {
		next(e);
	}
});

module.exports = router;
