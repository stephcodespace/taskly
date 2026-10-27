import { Task } from "@/types/task";

export const INITIAL_SAMPLE_TASKS: Task[] = [
  {
    id: "sample-task-1",
    title: "Review spesifikasi API antarmuka",
    description: "Periksa kembali skema response payload endpoint REST untuk sinkronisasi modul dashboard.",
    status: "todo",
    priority: "high",
    dueDate: "2026-10-20", // Tanggal lampau untuk memperlihatkan indikator lewat tenggat (overdue)
    createdAt: "2026-10-18T09:00:00.000Z",
    updatedAt: "2026-10-18T09:00:00.000Z",
  },
  {
    id: "sample-task-2",
    title: "Optimasi performa render Kanban",
    description: "Evaluasi re-render pada komponen kartu tugas menggunakan memoization dan profiling.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-28",
    createdAt: "2026-10-21T10:30:00.000Z",
    updatedAt: "2026-10-22T14:15:00.000Z",
  },
  {
    id: "sample-task-3",
    title: "Rancang sistem desain dan palet warna",
    description: "Tetapkan token warna Tailwind v4, rasio kontras WCAG, dan tipografi yang konsisten.",
    status: "done",
    priority: "medium",
    dueDate: "2026-10-22",
    createdAt: "2026-10-19T08:00:00.000Z",
    updatedAt: "2026-10-22T16:00:00.000Z",
  },
  {
    id: "sample-task-4",
    title: "Implementasi validasi form tugas",
    description: "Pastikan input judul bebas dari spasi berlebih dan menampilkan pesan error yang ramah pengguna.",
    status: "todo",
    priority: "low",
    dueDate: "2026-10-31",
    createdAt: "2026-10-23T11:00:00.000Z",
    updatedAt: "2026-10-23T11:00:00.000Z",
  },
  {
    id: "sample-task-5",
    title: "Setup state management dengan Zustand",
    description: "Konfigurasi persist middleware untuk penyimpanan data lokal browser dan cegah hydration mismatch.",
    status: "done",
    priority: "high",
    dueDate: "2026-10-23",
    createdAt: "2026-10-20T13:00:00.000Z",
    updatedAt: "2026-10-23T17:30:00.000Z",
  },
];
