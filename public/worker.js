// worker.js
self.onmessage = function (e) {
  console.log('Message received from main script');
  var workerResult = 'Received from main: ' + e.data;
  console.log('Posting message back to main script');
  self.postMessage(workerResult);
};
