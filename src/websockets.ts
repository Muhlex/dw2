import { writable } from "svelte/store";

export const websockets = writable(new Set<WebSocket>());
let $websockets: Set<WebSocket>;
websockets.subscribe(value => $websockets = value);

const create = (url: string) => new Promise<WebSocket>((resolve, reject) => {
	const ws = new WebSocket(url);
	const removeListeners = () => {
		ws.onopen = null;
		ws.onclose = null;
	};
	ws.onopen = () => {
		removeListeners();
		resolve(ws);
	};
	ws.onerror = event => {
		removeListeners();
		reject(event);
	};
});

export const connect = async (url: string) => {
	try {
		const ws = await create(url);
		const onEnd = () => {
			websockets.update(sockets => {
				sockets.delete(ws);
				return sockets;
			});
		};
		ws.onclose = onEnd;
		ws.onerror = onEnd;
		websockets.update(sockets => {
			sockets.add(ws);
			return sockets;
		});
	} catch (error) {
		const args = [`WebSocket connection to ${url} failed.`];
		if (error instanceof DOMException) args.push(error.message);
		console.error(...args);
	}
};

export const send = (data: Parameters<WebSocket["send"]>[0]) => {
	for (const socket of $websockets) {
		socket.send(data);
	}
};
