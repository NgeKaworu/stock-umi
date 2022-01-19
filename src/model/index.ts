export interface Stock {
  id: string; //ID
  code: string; //股票代码
  bourse: string; //交易所名字
  bourseCode: string; //交易所代码
  PB: number; //市净率
  PE: number; //市盈率
  PEG: number; //市盈增长比
  ROE: number; //净资产收益率
  DPE: number; //动态利润估值
  DPER: number; //动态利润估值率
  DCE: number; //动态现金估值
  DCER: number; //动态现金估值率
  AAGR: number; //平均年增长率
  classify: string; //板块
  name: string; //股票名字
  createAt: Date; // 创建时间
  grade: number; // 评分
}

export interface Weight {
  field: keyof Stock;
  isAsc: boolean;
  coefficient: number;
}

export const Sort2Num = new Map([
  [true, -1],
  [false, 1],
]);
