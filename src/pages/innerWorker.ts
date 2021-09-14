// worker.js
const workercode = () => {
  let lock = 0;

  self.onmessage = function (e) {
    if (lock > 0) return;
    lock++;
    console.log('self.onmessage', e);
    console.log('lock', lock);
    consumer();
  };

  function consumer() {
    setTimeout(() => {
      lock--;
      self.postMessage({ foo: 'bar' });
    }, 5000);
  }
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], { type: 'application/javascript' });
export default URL.createObjectURL(blob);
