const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// シードデータ（ユーザーが空の場合に自動作成）
async function ensureUsers() {
  const count = await prisma.user.count();
  if (count === 0) {
    await prisma.user.createMany({
      data: [
        { name: "田中", email: "tanaka@example.com" },
        { name: "佐藤", email: "sato@example.com" },
        { name: "鈴木", email: "suzuki@example.com" },
      ],
    });
  }
}
ensureUsers();
// --- API エンドポイント ---
// 1. ユーザー一覧取得
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
// 2. タスク一覧取得（担当者情報、議事録情報を結合）
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
// 3. タスクの進捗ステータス・期限の更新
app.patch("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { status, deadline } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status, deadline },
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 4. 議事録の保存 & タスクの自動自動抽出・複数人割り当てロジック
app.post("/api/meetings", async (req, res) => {
  const { title, content } = req.body;
  try {
    // 議事録の保存
    const meeting = await prisma.meeting.create({
      data: { title, content },
    });
    // 簡易自然言語パースによるタスク抽出
    const lines = content.split("\n");
    const extractedTasks = [];
    for (let line of lines) {
      const trimmed = line.trim();
      // 「・」か「-」で始まる行をタスク候補とする
      if (trimmed.startsWith("・") || trimmed.startsWith("-")) {
        let taskTitle = trimmed.replace(/^[・-]\s*/, "");
        // 担当者メンション（@名前）の抽出用（複数対応）
        const memberInfo = [];
        const allUsers = await prisma.user.findMany();
        allUsers.forEach((u) => {
          if (taskTitle.includes(`@${u.name}`)) {
            memberInfo.push(u.id);
            taskTitle = taskTitle.replace(`@${u.name}`, ""); // タイトルからメンションを除く
          }
        });
        taskTitle = taskTitle.trim();
        if (taskTitle) {
          // タスクレコード作成
          const task = await prisma.task.create({
            data: {
              title: taskTitle,
              status: "TODO",
              meetingId: meeting.id,
            },
          });
          // 中間テーブルへの複数人アサイン
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
// --- フロントエンド静的ファイルの配信設定（ビルド成果物） ---
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
