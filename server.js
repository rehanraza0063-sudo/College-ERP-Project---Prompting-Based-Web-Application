
    res.status(500).json({ error: err.message });
  }
});
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── STUDENTS ────────────────────────────────────────────────
app.get("/api/students", async (req, res) => {
  try {
    const { search, department, semester, status } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { rollNumber: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (department) where.department = department;
    if (semester) where.semester = parseInt(semester);
    if (status) where.status = status;

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(students);
  } catch (err) {
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { grades: { include: { course: true } } },
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const student = await prisma.student.create({ data: req.body });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── FACULTY ─────────────────────────────────────────────────
app.get("/api/faculty", async (req, res) => {
  try {
    const { search, department } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { employeeId: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (department) where.department = department;

    const faculty = await prisma.faculty.findMany({
      where,
      include: { courses: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/faculty/:id", async (req, res) => {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { courses: true },
    });
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/faculty", async (req, res) => {
  try {
    const faculty = await prisma.faculty.create({ data: req.body });
    res.status(201).json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/faculty/:id", async (req, res) => {
  try {
    const faculty = await prisma.faculty.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/faculty/:id", async (req, res) => {
  try {
    await prisma.faculty.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── COURSES ─────────────────────────────────────────────────
app.get("/api/courses", async (req, res) => {
  try {
    const { search, department, semester } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { courseName: { contains: search } },
        { courseCode: { contains: search } },
      ];
    }
    if (department) where.department = department;
    if (semester) where.semester = parseInt(semester);

    const courses = await prisma.course.findMany({
      where,
      include: { faculty: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { faculty: true, grades: { include: { student: true } } },
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function normalizeCourseData(body) {
  const data = { ...body };
  if (data.credits !== undefined) data.credits = parseInt(data.credits);
  if (data.semester !== undefined) data.semester = parseInt(data.semester);
  if (data.facultyId !== undefined && data.facultyId !== null && data.facultyId !== "") {
    data.facultyId = parseInt(data.facultyId);
    if (isNaN(data.facultyId)) data.facultyId = null;
  } else {
    data.facultyId = null;
  }
  return data;
}

app.post("/api/courses", async (req, res) => {
  try {
    const course = await prisma.course.create({ data: normalizeCourseData(req.body) });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/courses/:id", async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: normalizeCourseData(req.body),
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── GRADES / EXAMINATIONS ───────────────────────────────────
app.get("/api/grades", async (req, res) => {
  try {
    const { studentId, courseId, semester, academicYear } = req.query;
    const where = {};
    if (studentId) where.studentId = parseInt(studentId);
    if (courseId) where.courseId = parseInt(courseId);
    if (semester) where.semester = parseInt(semester);
    if (academicYear) where.academicYear = academicYear;

    const grades = await prisma.grade.findMany({
      where,
      include: { student: true, course: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/grades", async (req, res) => {
  try {
    const { marks, totalMarks } = req.body;
    const percentage = (marks / totalMarks) * 100;
    let grade;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";
    else grade = "F";

    const gradeEntry = await prisma.grade.create({
      data: { ...req.body, grade },
      include: { student: true, course: true },
    });
    res.status(201).json(gradeEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/grades/:id", async (req, res) => {
  try {
    const { marks, totalMarks } = req.body;
    const percentage = (marks / totalMarks) * 100;
    let grade;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";
    else grade = "F";

    const gradeEntry = await prisma.grade.update({
      where: { id: parseInt(req.params.id) },
      data: { ...req.body, grade },
      include: { student: true, course: true },
    });
    res.json(gradeEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/grades/:id", async (req, res) => {
  try {
    await prisma.grade.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Grade deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── DASHBOARD STATS ─────────────────────────────────────────
app.get("/api/dashboard", async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, activeStudents, departments] =
      await Promise.all([
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.course.count(),
        prisma.student.count({ where: { status: "Active" } }),
        prisma.student.groupBy({ by: ["department"], _count: true }),
      ]);

    const recentStudents = await prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const departmentStats = departments.map((d) => ({
      name: d.department,
      count: d._count,
    }));

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      activeStudents,
      departmentStats,
      recentStudents,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
