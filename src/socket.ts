import {Server} from 'socket.io';

import { Server as httpServer }  from 'http';

interface ServerToClientEvents {
  noArg: () => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

let io:Server;

const init = (httpServer: httpServer) => {
	 io = new Server<ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData>(httpServer, {cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST'],
		},});
		return io;
}

const getIO = () => {
	if (!io) {
		throw new Error('Socket.io not initialized');
	}
	return io;
}

export {init, getIO}
