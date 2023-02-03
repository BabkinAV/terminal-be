import { Server, Socket } from "socket.io";
import {ServerToClientEvents, ClientToServerEvents} from './socket';


const timerUpdate = (counter: number, maxCounter: number, currentUser: number, io:Server<ClientToServerEvents, ServerToClientEvents>, participantIdArray: string[]) => {

	if (counter%10 === 0) {
		console.log('Current counter value: ', counter)
	}
	if (counter === 0) {
		counter = maxCounter
		currentUser = (currentUser === 3) ? 0 : ++currentUser;
		console.log('Timer reset! Current timer value: ', counter, 'Current user: ', currentUser);
		io.emit('timerReset', counter,  participantIdArray[currentUser]);
	}
	counter--;

	return [counter, currentUser];
	
}

const registerTimerSkip = (io: Server, socket: Socket<ClientToServerEvents, ServerToClientEvents>, intervalId:   NodeJS.Timer, counter: number, maxCounter:number, currentUser: number, participantIdArray: string[]): [ number, number] => {
				clearInterval(intervalId);
					counter = maxCounter;
					currentUser = (currentUser === 3) ? 0 : ++currentUser;
					console.log('Manual timer reset! Current timer: ', counter, 'Current user: ', currentUser);
					io.emit('timerReset', counter, participantIdArray[currentUser]);
				return [ counter, currentUser ]
}





export  {timerUpdate, registerTimerSkip};