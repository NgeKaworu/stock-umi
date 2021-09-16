let lock = 0;

const Sort2Num = new Map([
  [true, -1],
  [false, 1],
]);

self.onmessage = function (e) {
  if (lock > 0) {
    return postMessage({ type: 'locked' });
  }
  lock++;

  const { type, payload } = e?.data ?? {};
  switch (type) {
    case 'calc':
      return postMessage({ type: 'success', payload: calc(payload) });
    default:
      break;
  }

  self.onerror = function (e) {
    console.error(e);
  };

  function calc({ weights, dataSource }) {
    const temp = [...dataSource],
      includesKey = weights?.map((w) => w.field);
    processed = preprocess(temp, includesKey);
    weights?.forEach(sortWeight(processed));
    lock--;
    return processed;
  }

  function preprocess(dataSource, includesKey) {
    const g = group(dataSource);
    let ret = [];
    for (const [_, value] of g) {
      let sum = value?.[0];
      for (let i = 1; i < value?.length; i++) {
        const cur = value[i];
        includesKey?.forEach((key) => {
          sum[key] = safeAdd(cur?.[key], sum?.[key]);
        });
      }

      includesKey?.forEach((key) => {
        sum[key] = safeDivision(sum[key], value?.length);
      });

      ret.push(sum);
    }
    return ret;
  }

  function group(dataSource) {
    let m = new Map();
    for (const stock of dataSource) {
      const { code, bourse, bourseCode } = stock,
        key = `${bourse}${bourseCode}-${code}`;
      if (!m.has(key)) {
        m.set(key, []);
      }
      m.get(key).push(stock);
    }
    return m;
  }

  function sortWeight(dataSource) {
    return ({ isAsc, field, coefficient }) => {
      dataSource.sort(
        (a, b) => +a?.[field] - +b?.[field] * (Sort2Num?.get(isAsc) ?? 1),
      );

      dataSource.forEach(
        (ds, idx, arr) =>
          (ds.grade = ((ds.grade ?? 0) + arr?.length - idx) * coefficient),
      );
    };
  }
};

function safeAdd(a, b) {
  return a ?? 0 + b ?? 0;
}

function safeDivision(a, b) {
  return a ?? 0 / b ?? 1;
}
