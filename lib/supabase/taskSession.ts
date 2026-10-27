
import { createClient } from "@/lib/supabase/client";
import { fetchTasks } from "@/lib/supabase/tasks";
import { useTaskStore } from "@/store/useTaskStore";
import {
  setStorageWriteAllowed,
} from "@/lib/storeAuthBridge";

let sessionRequestId = 0;

export async function handleTaskSessionChange(
  userId: string | null,
): Promise<void> {
  const requestId = ++sessionRequestId;
  const store = useTaskStore.getState();

  // Jangan menyimpan task cloud ke localStorage.
  setStorageWriteAllowed(false);

  if (!userId) {
    // Guest menggunakan data lokal yang sudah dimuat.
    store.setActiveUserId(null);
    store.setMode("guest");
    store.setPhase("ready");
    setStorageWriteAllowed(true);
    return;
  }

  store.setPhase("loading_cloud");
  store.setMode("cloud");
  store.setActiveUserId(userId);

  // Kosongkan task akun sebelumnya sebelum memuat akun baru.
  useTaskStore.setState({ tasks: [] });

  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    // Batalkan hasil lama jika sesi sudah berganti.
    if (requestId !== sessionRequestId) return;

    if (!user || user.id !== userId) {
      throw new Error("The active session has changed. Please try again.");
    }

    const tasks = await fetchTasks(userId);

    if (requestId !== sessionRequestId) return;

    useTaskStore.setState({
      tasks,
      mode: "cloud",
      activeUserId: userId,
      phase: "ready",
      storageError: null,
    });
  } catch (error) {
    if (requestId !== sessionRequestId) return;

    console.error("Failed to load cloud tasks:", error);

    useTaskStore.setState({
      tasks: [],
      mode: "cloud",
      activeUserId: userId,
      phase: "error",
      storageError:
        "Your online tasks could not be loaded. Please try again before making changes.",
    });
  }
}

