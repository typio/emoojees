import { toastStore } from './stores.ts';

export const addToast = (
    title: string,
    emoji_mode: 'code' | 'emoji',
    emoji: string,
    duration: number
) => {
    const newToast = { title, emoji_mode, emoji };

    // Add the toast to the store
    toastStore.update((toasts) => [...toasts, newToast]);

    // Remove the toast after the duration
    setTimeout(() => {
        toastStore.update((toasts) =>
            toasts.filter((toast) => toast !== newToast)
        );
    }, duration);
};