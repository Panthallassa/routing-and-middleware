const request = require("supertest");
const app = require("./app");
const items = require("./fakeDb");

beforeEach(() => {
	items.length = 0;
	items.push({ name: "popsicle", price: 1.45 });
	items.push({ name: "cheerios", price: 3.4 });
});

// GET /items - Test getting all items
describe("GET /items", () => {
	test("Gets a list of items", async () => {
		const res = await request(app).get("/items");
		expect(res.statusCode).toBe(200);
		expect(res.body.items).toEqual([
			{ name: "popsicle", price: 1.45 },
			{ name: "cheerios", price: 3.4 },
		]);
	});
});

// POST /items - Test adding a new item
describe("POST /items", () => {
	test("Adds a new item", async () => {
		const newItem = { name: "apple", price: 0.99 };
		const res = await request(app)
			.post("/items")
			.send(newItem);
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: newItem });
		expect(items).toContainEqual(newItem);
	});

	test("Responds with 400 if name or price is missing", async () => {
		const res = await request(app).post("/items").send({});
		expect(res.statusCode).toBe(400);
	});
});

// GET /items/:name - Test getting a single item by name
describe("GET /items/:name", () => {
	test("Gets a single item by name", async () => {
		const res = await request(app).get("/items/popsicle");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			name: "popsicle",
			price: 1.45,
		});
	});

	test("Responds with 404 if item not found", async () => {
		const res = await request(app).get(
			"/items/nonexistent"
		);
		expect(res.statusCode).toBe(404);
	});
});

// PATCH /items/:name - Test updating an item
describe("PATCH /items/:name", () => {
	test("Updates an item's name and price", async () => {
		const res = await request(app)
			.patch("/items/popsicle")
			.send({ name: "new popsicle", price: 2.99 });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			updated: { name: "new popsicle", price: 2.99 },
		});
	});

	test("Responds with 404 if item not found", async () => {
		const res = await request(app)
			.patch("/items/nonexistent")
			.send({ name: "new name" });
		expect(res.statusCode).toBe(404);
	});
});

// DELETE /items/:name - Test deleting an item
describe("DELETE /items/:name", () => {
	test("Deletes an item", async () => {
		const res = await request(app).delete(
			"/items/popsicle"
		);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: "Deleted" });
		expect(items).not.toContainEqual({
			name: "popsicle",
			price: 1.45,
		});
	});

	test("Responds with 404 if item not found", async () => {
		const res = await request(app).delete(
			"/items/nonexistent"
		);
		expect(res.statusCode).toBe(404);
	});
});
