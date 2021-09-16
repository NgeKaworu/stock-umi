import { safeAdd, safeDivision } from '@/utils/number';
import { Weight, Stock, Sort2Num } from './modal';

const worker: Worker = self as any;

let lock = 0;

worker.onmessage = function (e) {
  if (lock > 0) {
    return postMessage({ type: 'locked' });
  }
  lock++;
  console.log('worker.onmessage', e);
  console.log('lock', lock);

  const { type, payload } = e?.data ?? {};
  switch (type) {
    case 'calc':
      worker.postMessage({ type: 'success', payload: calc(payload) });
      break;
    default:
      break;
  }

  worker.onerror = function (e) {
    console.log(e);
  };

  async function calc({
    weights,
    dataSource,
  }: {
    weights: Weight[];
    dataSource: Stock[];
  }) {
    const temp = [...dataSource],
      includesKey = weights?.map((w) => w.field);
    console.log('includesKey', includesKey);
    weights?.forEach(sortWeight(preprocess(temp, includesKey)));
    console.log('temp', temp);
    return temp;
  }

  function preprocess(
    dataSource: Stock[],
    includesKey: Weight['field'][],
  ): Stock[] {
    const g = group(dataSource);
    let ret: Stock[] = [];
    console.log('group', g);
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
    console.log('ret', ret);
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
    return ({ isAsc, field, coefficeient }: Weight) => {
      dataSource.sort(
        (a, b) => +a?.[field] - +b?.[field] * (Sort2Num?.get(isAsc) ?? 1),
      );

      dataSource.forEach(
        (ds, idx, arr) =>
          (ds.grade = ((ds.grade ?? 0) + arr?.length - idx) * coefficeient),
      );
    };
  }
};

export default worker;
