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

const removeSocketIndex = (index: number) => {
	if (!sockets[index]) throw new Error(`${index} is not a valid WebSocket index.`);
	sockets.splice(index, 1);
	notify();
};

export const connect = async (url: string) => {
	try {
		const socket = await create(url);

		const onEnd = () => {
			const socketIndex = sockets.indexOf(socket);
			removeSocketIndex(socketIndex);
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

export const send = (socket: WebSocket, data: Parameters<WebSocket["send"]>[0]) => {
	socket.send(data);
};
export const sendIndex = (index: number, data: Parameters<WebSocket["send"]>[0]) => {
	sockets[index].send(data);
};
export const sendAll = (data: Parameters<WebSocket["send"]>[0]) => {
	for (const socket of sockets) {
		send(socket, data);
	}
};
export const close = (socket: WebSocket) => {
	closeIndex(sockets.indexOf(socket));
};
export const closeIndex = (index: number) => {
	sockets[index].close();
	removeSocketIndex(index);
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
