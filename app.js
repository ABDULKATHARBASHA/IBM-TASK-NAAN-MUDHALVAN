const express = require("express");

const app = express();
const PORT = 9999; // Changed port to 9999

// Middleware to parse JSON
app.use(express.json());

// Initial student list with 2 students
let students = [
  { id: 1, name: "Alice", age: 20, dept: "IT" },
  { id: 2, name: "Bob", age: 22, dept: "HR" }
];

// Track next ID for new students
let nextId = 3;

// Helper: safely parse ID
function parseId(idParam) {
  const id = Number(idParam);
  return Number.isNaN(id) ? null : id;
}

// READ - Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// READ - Get student by ID
app.get("/students/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid ID" });

  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  res.json(student);
});

// CREATE - Add new student
app.post("/students", (req, res) => {
  const { name, age, dept } = req.body;

  if (typeof name !== "string" || name.trim() === "" ||
      typeof age !== "number" ||
      typeof dept !== "string" || dept.trim() === "") {
    return res.status(400).json({ error: "Provide valid name (string), age (number), dept (string)" });
  }

  const newStudent = { id: nextId++, name: name.trim(), age, dept: dept.trim() };
  students.push(newStudent);
  res.status(201).json({ message: "Student created", student: newStudent });
});

// UPDATE - Modify student by ID
app.put("/students/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid ID" });

  const student = students.find(s => s.id === id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const { name, age, dept } = req.body;
  if (typeof name !== "string" || name.trim() === "" ||
      typeof age !== "number" ||
      typeof dept !== "string" || dept.trim() === "") {
    return res.status(400).json({ error: "Provide valid name (string), age (number), dept (string)" });
  }

  student.name = name.trim();
  student.age = age;
  student.dept = dept.trim();

  res.json({ message: "Student updated successfully", student });
});

// DELETE - Remove student by ID
app.delete("/students/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid ID" });

  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const [removed] = students.splice(index, 1);
  res.json({ message: "Student deleted successfully", student: removed });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
