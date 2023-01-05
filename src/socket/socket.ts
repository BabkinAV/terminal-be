import {Server} from 'socket.io';

import { Server as httpServer }  from 'http';

interface ServerToClientEvents {
  noArg: () => void;
	timerReset: (counter: number, currentUser: number) => void;
	currentTimer: (counter: number, currentUser: number) => void;
}

interface ClientToServerEvents {
	timerSkip: () => void;
  
}

let io:Server<ClientToServerEvents,
ServerToClientEvents>;

const init = (httpServer: httpServer) => {
	 io = new Server<ClientToServerEvents,
		ServerToClientEvents>(httpServer, {cors: {
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
