// worker.js blob 版
const workercode = () => {
  let lock = 0;

  self.onmessage = function (e) {
    if (lock > 0) {
      return self.postMessage({ type: 'locked' });
    }
    lock++;
    console.log('self.onmessage', e);
    console.log('lock', lock);
  };

  self.onerror = function (e) {
    console.log(e);
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([code], { type: 'application/javascript' });
export default URL.createObjectURL(blob);
