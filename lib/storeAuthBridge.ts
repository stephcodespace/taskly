
type HydrationCallback = (success: boolean) => void;
type SessionHandler = (userId: string | null) => Promise<void> | void;

let hydrationCompleted = false;
let hydrationSucceeded = false;
let hydrationCallback: HydrationCallback | null = null;
let sessionHandler: SessionHandler | null = null;

// Penulisan lokal dinonaktifkan sampai mode aplikasi dipastikan.
let allowStorageWrite = false;

export function registerHydrationCallback(
  callback: HydrationCallback,
) {
  hydrationCallback = callback;

  if (hydrationCompleted) {
    callback(hydrationSucceeded);
  }
}

export function notifyHydrationComplete(success: boolean) {
  hydrationCompleted = true;
  hydrationSucceeded = success;
  hydrationCallback?.(success);
}

export function setStorageWriteAllowed(allowed: boolean) {
  allowStorageWrite = allowed;
}

export function isStorageWriteAllowed() {
  return allowStorageWrite;
}

export function registerSessionHandler(
  handler: SessionHandler,
) {
  sessionHandler = handler;
}

export async function notifySessionChanged(
  userId: string | null,
) {
  await sessionHandler?.(userId);
}
