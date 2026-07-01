const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// シードデータ
async function ensureUsers() {
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.createMany({
      data: [
        { name: "田中", email: "tanaka@example.com", role: "ADMIN" },
        { name: "佐藤", email: "sato@example.com", role: "MEMBER" },
        { name: "鈴木", email: "suzuki@example.com", role: "MEMBER" },
      ],
    });
  }
}
ensureUsers();

// --- API エンドポイント ---

// 1. ユーザー一覧取得
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json(users);
});

// [NEW] ユーザー追加
app.post("/api/users", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email, role: role || "MEMBER" }
    });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [NEW] ユーザー削除
app.delete("/api/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. タスク一覧取得
app.get("/api/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      assignments: { include: { user: true } },
      meeting: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
});

// 3. タスクの更新
app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status, deadline, title } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status, deadline, title },
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [NEW] タスクの削除
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. 議事録の保存 & タスクの自動抽出
app.post("/api/meetings", async (req, res) => {
  const { title, content } = req.body;
  try {
    const meeting = await prisma.meeting.create({
      data: { title, content },
    });
    const lines = content.split("\n");
    const extractedTasks = [];
    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("・") || trimmed.startsWith("-")) {
        let taskTitle = trimmed.replace(/^[・-]\s*/, "");
        const memberInfo = [];
        const allUsers = await prisma.user.findMany();
        allUsers.forEach((u) => {
          if (taskTitle.includes(`@${u.name}`)) {
            memberInfo.push(u.id);
            taskTitle = taskTitle.replace(`@${u.name}`, "");
          }
        });
        taskTitle = taskTitle.trim();
        if (taskTitle) {
          const task = await prisma.task.create({
            data: { title: taskTitle, status: "TODO", meetingId: meeting.id },
          });
          for (let userId of memberInfo) {
            await prisma.taskAssignment.create({
              data: { taskId: task.id, userId: userId },
            });
          }
          extractedTasks.push(task);
        }
      }
    }
    res.json({ success: true, meeting, tasksCount: extractedTasks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});