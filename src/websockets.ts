import { readable } from "svelte/store";

const sockets:  WebSocket[] = [];
let notify: () => void;
const store = readable(sockets, set => {
	notify = () => set(sockets);
});

export { store as websockets };

export type OpenCallback = (data: { socketIndex: number, socket: WebSocket }) => void;
export type EndCallback = (data: { socketIndex: number, socket: WebSocket }) => void;
export type MessageCallback = (data: { socketIndex: number, socket: WebSocket, event: MessageEvent }) => void;
const callbacks = {
	open: new Set<OpenCallback>,
	end: new Set<EndCallback>,
	message: new Set<MessageCallback>,
};

const create = (url: string) => new Promise<WebSocket>((resolve, reject) => {
	const socket = new WebSocket(url);
	const removeListeners = () => {
		socket.onopen = null;
		socket.onclose = null;
	};
	socket.onopen = () => {
		removeListeners();
		resolve(socket);
	};
	socket.onerror = event => {
		removeListeners();
		reject(event);
	};
});

export const connect = async (url: string) => {
	try {
		const socket = await create(url);

		const onEnd = () => {
			sockets.splice(sockets.indexOf(socket), 1);
			notify();
			const socketIndex = sockets.indexOf(socket);
			for (const callback of callbacks.end) {
				callback({ socketIndex, socket });
			}
		};
		socket.onclose = onEnd;
		socket.onerror = onEnd;
		socket.onmessage = event => {
			const socketIndex = sockets.indexOf(socket);
			for (const callback of callbacks.message) {
				callback({ socketIndex, socket, event });
			}
		};
		sockets.push(socket);
		notify();
		const socketIndex = sockets.indexOf(socket);
		for (const callback of callbacks.open) {
			callback({ socketIndex, socket });
		}
	} catch (error) {
		const args = [`WebSocket connection to ${url} failed.`];
		if (error instanceof DOMException) args.push(error.message);
		console.error(...args);
	}
};

export const send = (index: number, data: Parameters<WebSocket["send"]>[0]) => {
	sockets[index].send(data);
};
export const sendAll = (data: Parameters<WebSocket["send"]>[0]) => {
	for (const socket of sockets) {
		socket.send(data);
	}
};

export const listenOpen = (callback: OpenCallback) => {
	callbacks.open.add(callback);
};
export const unlistenOpen = (callback: OpenCallback) => {
	return callbacks.open.delete(callback);
};
export const listenEnd = (callback: EndCallback) => {
	callbacks.end.add(callback);
};
export const unlistenEnd = (callback: EndCallback) => {
	return callbacks.end.delete(callback);
};
export const listenMessage = (callback: MessageCallback) => {
	callbacks.message.add(callback);
};
export const unlistenMessage = (callback: MessageCallback) => {
	return callbacks.message.delete(callback);
};
