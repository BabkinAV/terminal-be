import { Server, Socket } from "socket.io";
import {ServerToClientEvents, ClientToServerEvents} from './socket';


const timerUpdate = (counter: number, currentUser: number, io:Server<ClientToServerEvents, ServerToClientEvents>) => {

	if (counter%5 === 0) {
		console.log('Current counter value: ', counter)
	}
	if (counter === 0) {
		counter = 30
		currentUser = (currentUser === 3) ? 0 : ++currentUser;
		console.log('Timer reset! Current timer value: ', counter, 'Current user: ', currentUser);
		io.emit('timerReset', counter, currentUser);
	}
	counter--;

	return [counter, currentUser];
}

const registerTimerSkip = (io: Server, socket: Socket<ClientToServerEvents, ServerToClientEvents>, intervalId:   NodeJS.Timer, counter: number, currentUser: number): [NodeJS.Timer, number, number] => {
	const token = socket.handshake.auth.token;
				if (token === 'abcd') {
					clearInterval(intervalId);
					counter = 30;
					currentUser = (currentUser === 3) ? 0 : ++currentUser;
					console.log('Manual timer reset! Current timer: ', counter, 'Current user: ', currentUser);
					io.emit('timerReset', counter, currentUser);
					intervalId = setInterval(() => {

						[counter, currentUser] = timerUpdate(counter, currentUser, io)
					
					}, 1000);
				} else {
					console.log('connection refused')
					socket.emit('authError', 'authentication error!' );
				}
				return [intervalId, counter, currentUser]
}


export  {timerUpdate, registerTimerSkip};