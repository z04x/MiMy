interface Dialog {
    dialog_id: number;
    model: string;
    title?: string;
    updated_at?: string;
    user_id: number;
    created_at: string;
}

interface Message {
    prompt: string;
}

const BASE_URL = 'http://localhost:3333';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function createDialog(userId: number, model: string): Promise<{ dialog_id: number }> {
    return fetchJson('/dialogs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, model }),
    });
}

export async function getAllDialogs(): Promise<Dialog[]> {
    return fetchJson('/dialogs/');
}

export async function addMessage(dialogId: number, prompt: string): Promise<void> {
    return fetchJson(`/dialogs/${dialogId}/messages/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });
}
export async function getMessagesFromDialog(dialogId: number): Promise<Message[]> {
    return fetchJson(`/dialogs/${dialogId}/messages/`);
}
