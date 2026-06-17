type ToastListener = (message: string) => void;

let listeners: ToastListener[] = [];

export function showToast(message: string) {
  listeners.forEach((fn) => fn(message));
}

export function subscribeToast(fn: ToastListener) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export async function copyToClipboard(text: string, message = "Copied to clipboard"): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
    return true;
  } catch {
    showToast("Copy failed — please copy manually");
    return false;
  }
}
