// Let's now write sm code to get sm understandings of what happens in the Event loop
const fs = require('fs');
const crypto = require('crypto');
// 1) Outside the event loop
// setTimeout(() => console.log('Timer 1 finished'), 0);
// setImmediate(() => console.log('Immediate 1 finished'));

// fs.readFile('test-file.txt', () => {
//   console.log('I/O finished');

// });

// console.log('Hello from the top-level code'); // This is a top level code bcos it is the only one that is not inside
// a callback fc

// From the lecture of b4, the top-level code is what will be executed 1st followed by the others in the callback().
// The order of the 3 callback()'s are not affected by the event loop bcos they are not in the event loop.
// Remember how node.js decides if it should continue running the event loop, well it does so by asking if there is still
// any time running in the background, and if so, it will not finish, and if there is still a pending timer, well then
// it's not gonna exit the program. But if there is not, which was the case for the 1st e.g above, then it immediately
// exits the program.

////////
// 2) Inside the event loop
// But for us to see what happens let us placed them in the event loop.
// So we will move all the fcs into the readFile() callback fc
// For the 2nd e.g below, we have one timer, so this one will run for 3000ms(3s). We can see for this one that it did
// not exit the program, but only after 3secs has finished i.e when timer 3 has finished, it did tthen exit the application.

// setTimeout(() => console.log('Timer 1 finished'), 0);
// setImmediate(() => console.log('Immediate 1 finished'));

// fs.readFile('test-file.txt', () => {
//   console.log('I/O finished');
//   console.log('--------------------');

//   setTimeout(() => console.log('Timer 2 finished'), 0);
//   setTimeout(() => console.log('Timer 3 finished'), 3000);
//   setImmediate(() => console.log('Immediate 2 finished'));
// });

// console.log('Hello from the top-level code'); // This is a top level code bcos it is the only one that is not inside
// a callback fc

// Also the 4 outputs b4 the "-------------" are the outputs that were not really running in the event loop, but the 3
// after "----------" were actually coming from the event loop, so let's analyze these results.
// Now if we analyze the diagram from the prev lecture, u'll probably have thought, that the timer "setTimeout(() => console.log('Timer 2 finished'), 0);"
// should actually finish b4 the "setImmediate(() => console.log('Immediate 2 finished'));" bcos in the diagram and our
// code it appeared 1st right at the top of the event loop. So in the code we have the 1st setTimeout() b4 the setImmediate(),
// which should kind of be the same as the setImmediate(), right?. So why does setTImmediate actually appear b4 the setTimeout()?
// Now there is smth i did not explain in the last video, bcos i did not want to make it even more confusing. And that is the
// event loop actually waits for stuff to happen in poll phase. So in that Phase where I/O callbacks are handled. So when this
// queue of callbacks is empty, which is the case in our fictional e.g, so we have no I/O callbacks, all we have is the timers,
// well then the event loop will wait in this phase until there is an expired timer. But if we scheduled a callbck using setImmediate,
// then that callback will actually be executed right away after the polling phase, and even b4 expired timers, if there is one.
// And in this case, the timer expires right away, so after 0sec, but again, the event loop actually waits, so it pauses in the
// polling phase. And so that setImmediate callback is actually executed 1st, so that is the whole reason we have the setImmediate
// b4 we have the setTimeout. and this is how node.js works.

/////////////////
//3) Adding the process.nextTick()
// And now let's make this even a little more confusing and add the process.nextTick() that we talked about also in the last lecture.

// setTimeout(() => console.log('Timer 1 finished'), 0);
// setImmediate(() => console.log('Immediate 1 finished'));

// fs.readFile('test-file.txt', () => {
//   console.log('I/O finished');
//   console.log('--------------------');

//   setTimeout(() => console.log('Timer 2 finished'), 0);
//   setTimeout(() => console.log('Timer 3 finished'), 3000);
//   setImmediate(() => console.log('Immediate 2 finished'));

//   process.nextTick(() => console.log('Process.nextTick()'));
// });

// console.log('Hello from the top-level code'); // This is a top level code bcos it is the only one that is not inside
// // a callback fc

// Now for the above, our 1st callback is the process.nextTick(). Now  remember that "nextTick()" is part of the micro tasks queue
// which gets executed after each phase, so not just after one entire tick. And so what happened here is that this  process.nextTick(() => console.log('Process.nextTick()'));
// actually ran b4 the phase where "setImmediate(() => console.log('Immediate 2 finished'));" ran, and the phase b4 that.

// Now netTick() is actually a really misleading name, bcos a "tick()" is actually an entire loop, but "nextTick()" actually happens
// b4 the next loop phase, and not the entire tick, so that's what i was saying b4. Then on the other side, setImmediate() would
// make u think that it's callback would be executed immediately, but it actually doesn't, so the setImmediate() actually gets executed
// once per tick, while nextTick gets executed immediately. And so their two names should actually be switched.
// To finish i just want to introduce the Thread pool as well.

//////////
// 4) Thread pool:
// For this we will do an advanced e.g just to show us how it works. So we will use a cryptography just to encrypt a password.
// For the purpose of this e.g, i want to show u the no. of time these callbacks take to execute.

// NB: The below was the way Jonas schmedtmann ran the code with the "process.env.UV_THREADPOOL_SIZE = 3;".
// But for me it did not work that way, so chatGPT, helped me and said i needed to do it as below to achieve the result of Jonas:
/* 
On the VSC terminal we will run this first " $env:UV_THREADPOOL_SIZE = "2" " , press enter and then run the code
doing "node 005TheEventLoopinPractice"and also press enter.

*/

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 3;

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
  console.log('--------------------');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick()'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    // This will give us the amount of millisec passed for this calculations to occur
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    // This will give us the amount of millisec passed for this calculations to occur
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    // This will give us the amount of millisec passed for this calculations to occur
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    // This will give us the amount of millisec passed for this calculations to occur
    console.log(Date.now() - start, 'Password encrypted');
  });
});

console.log('Hello from the top-level code'); // This is a top level code bcos it is the only one that is not inside
// a callback fc

// From the log, we see it took 1851sec, almost 2sec to encrypt this password

// So above i will duplicate the crypto code into 4 places to show u smth
// So remember that i told u in one of the early lectures, that by default the size of the thread pool is 4, there is 4 threads doing
// the work at the same time, and so that's why these 4 password encryptions take approximately the same time and happen basically all
// at the same time. But we can actually change that thread pool size by doing:
// "process.env.UV_THREADPOOL_SIZE = 1":
// Setting it to 1, we will only have one thread in our thread pool i.e they will take longer time in being executed. Basically, they
// are calculated one after the other.
// "process.env.UV_THREADPOOL_SIZE = 2":
//  We will see the 1st 2 with almost the same time and also the 3rd and 4th. And the
// "process.env.UV_THREADPOOL_SIZE = 3":
// We will see the 1st 3 almost at the same time, while the last will be far apart.
// "process.env.UV_THREADPOOL_SIZE = 4":
// We will see almost 4 of them at the same time.

// NB: The above was the way Jonas schmedtmann ran the code with the "process.env.UV_THREADPOOL_SIZE = 3;".
// But for me it did not work that way, so chatGPT, helped me and said i needed to do it as below to achieve the result of Jonas:
/* 
On the VSC terminal we will run this first " $env:UV_THREADPOOL_SIZE = "2" " , press enter and then run the code
doing "node 005TheEventLoopinPractice"and also press enter.

*/
