import { Server } from "socket.io";

const timerUpdate = (counter: number, currentUser: number, io:Server) => {

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


export  {timerUpdate};