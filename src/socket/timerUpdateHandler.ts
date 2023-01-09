import { Server, Socket } from "socket.io";
import {ServerToClientEvents, ClientToServerEvents} from './socket';
import { timerUpdate } from "./timerHandler";


const registerTimerSkip = (io: Server, socket: Socket<ClientToServerEvents, ServerToClientEvents>, intervalId:   NodeJS.Timer, counter: number, currentUser: number): [ number, number] => {
	const token = socket.handshake.auth.token;
				clearInterval(intervalId);
					counter = 30;
					currentUser = (currentUser === 3) ? 0 : ++currentUser;
					console.log('Manual timer reset! Current timer: ', counter, 'Current user: ', currentUser);
					io.emit('timerReset', counter, currentUser);
				return [ counter, currentUser ]
}

export {registerTimerSkip}