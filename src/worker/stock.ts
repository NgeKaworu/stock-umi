import { safeAdd, safeDivision } from '@/utils/number';
import { Weight, Stock, Sort2Num } from '../model';

let lock = 0;

self.onmessage = (e) => {
  if (lock > 0) {
    return self.postMessage({ type: 'locked' });
  }
  lock++;

  const { type, payload } = e?.data ?? {};
  switch (type) {
    case 'calc':
      return self.postMessage({ type: 'success', payload: calc(payload) });
    default:
      return self.postMessage({ type: 'unknown', payload: e?.data });
  }
};

self.onerror = (e) => {
  console.error(e);
};

function calc({ weights, dataSource }: { weights: Weight[]; dataSource: Stock[] }) {
  const temp = [...dataSource],
    includesKey = weights?.map((w) => w.field),
    processed = preprocess(temp, includesKey);
  weights?.forEach(sortWeight(processed));
  lock--;
  return processed;
}

function preprocess(dataSource: Stock[], includesKey: Weight['field'][]): Stock[] {
  const g = group(dataSource);
  let ret: Stock[] = [];
  for (const [_, value] of g) {
    let sum: Stock = value?.[0];
    for (let i = 1; i < value?.length; i++) {
      const cur = value[i];
      includesKey?.forEach((key) => {
        (sum[key] as number) = safeAdd(cur?.[key], sum?.[key]);
      });
    }

    includesKey?.forEach((key) => {
      (sum[key] as number) = safeDivision(sum[key], value?.length);
    });

    ret.push(sum);
  }
  return ret;
}

function group(dataSource: Stock[]): Map<string, Stock[]> {
  let m = new Map<string, Stock[]>();
  for (const stock of dataSource) {
    const { code, bourse, bourseCode } = stock,
      key = `${bourse}${bourseCode}-${code}`;
    if (!m.has(key)) {
      m.set(key, []);
    }
    m.get(key)!.push(stock);
  }
  return m;
}

function sortWeight(dataSource: Stock[]) {
  return ({ isAsc, field, coefficient: coefficient }: Weight) => {
    dataSource.sort((a, b) => +a?.[field] - +b?.[field] * (Sort2Num?.get(isAsc) ?? 1));

    dataSource.forEach(
      (ds, idx, arr) => (ds.grade = ((ds.grade ?? 0) + arr?.length - idx) * coefficient),
    );
  };
}
