import { ModalSchma } from "@/models/global";

import { RESTful } from "@/http";

export interface InfoTime {
  _id: string;
}

export interface Enterprise {
  "id": string;
  "CreateDate": string;
  "code": string; //股票代号
  "ReportDate": string; //报告日期
  "Title": string; //报告名称
  "Epsjb": string; //基本每股收益(元)
  "Epskcjb": string; //扣非每股收益(元)
  "Epsxs": string; //稀释每股收益(元)
  "Bps": string; //每股净资产(元)
  "Mgzbgj": string; //每股资本公积(元)
  "Mgwfplr": string; //每股未分配利润(元)
  "Mgjyxjje": string; //每股经营现金流(元)
  "Totalincome": string; //营业总收入(元)
  "Grossprofit": string; //毛利润(元)
  "Parentnetprofit": string; //归属净利润(元)
  "Bucklenetprofit": string; //扣非净利润(元)
  "Totalincomeyoy": string; //营业总收入同比增长
  "Parentnetprofityoy": string; //归属净利润同比增长
  "Bucklenetprofityoy": string; //扣非净利润同比增长
  "Totalincomerelativeratio": string; //营业总收入滚动环比增长
  "Parentnetprofitrelativeratio": string; //归属净利润滚动环比增长
  "Bucklenetprofitrelativeratio": string; //扣非净利润滚动环比增长
  "Roejq": string; //净资产收益率(加权)
  "Roekcjq": string; //净资产收益率(扣非/加权)
  "Allcapitalearningsrate": string; //总资产收益率(加权)
  "Grossmargin": string; //毛利率
  "Netinterest": string; //净利率
  "Accountsrate": string; //预收账款/营业收入
  "Salesrate": string; //销售净现金流/营业收入
  "Operatingrate": string; //经营净现金流/营业收入
  "Taxrate": string; //实际税率
  "Liquidityratio": string; //流动比率
  "Quickratio": string; //速动比率
  "Cashflowratio": string; //现金流量比率
  "Assetliabilityratio": string; //资产负债率
  "Equitymultiplier": string; //权益乘数
  "Equityratio": string; //产权比率
  "Totalassetsdays": string; //总资产周转天数(天)
  "Inventorydays": string; //存货周转天数(天)
  "Accountsreceivabledays": string; //应收账款周转天数(天)
  "Totalassetrate": string; //总资产周转率(次)
  "Inventoryrate": string; //存货周转率(次)
  "Accountsreceiveablerate": string; //应收账款周转率(次)
}

export interface CurrentInfo {
  "name": string;
  "todayOpeningPrice": string;
  "yesterdayOpeningPrice": string;
  "currentPrice": string;
  "topPrice": string;
  "floorPrice": string;
  "bidPrice": string;
  "auctionPrice": string;
  "vol": string;
  "amount": string;
  "buy1Num": string;
  "buy1Price": string;
  "buy2Num": string;
  "buy2Price": string;
  "buy3Num": string;
  "buy3Price": string;
  "buy4Num": string;
  "buy4Price": string;
  "buy5Num": string;
  "buy5Price": string;
  "sell1Num": string;
  "sell1Price": string;
  "sell2Num": string;
  "sell2Price": string;
  "sell3Num": string;
  "sell3Price": string;
  "sell4Num": string;
  "sell4Price": string;
  "sell5Num": string;
  "sell5Price": string;
  "date": string;
  "time": string;
  "id": string;
  "createDate": string;
  "code": string;
  "classify": string;
}

// Stock 股票基本结构
export interface StockStruct {
  Enterprise?: Enterprise[]; //年报列表
  CurrentInfo?: CurrentInfo; //当前信息
  PB?: number; //市净率
  PE?: number; //市盈率
  PEG?: number; //市盈增长比
  ROE?: number; //净资产收益率
  DPE?: number; //动态利润估值
  DPER?: number; //动态利润估值率
  DCE?: number; //动态现金估值
  DCER?: number; //动态现金估值率
  AAGR?: number; //平均年增长率
  Grade?: number; //评分
  Calc(): StockStruct;
  Discount(r: number): StockStruct;
  CalcPB(): StockStruct;
  CalcPE(): StockStruct;
  CalcAAGR(): StockStruct;
  CalcPEG(): StockStruct;
  CalcROE(): StockStruct;
  CalcDCE(r: number): StockStruct;
  CalcDCER(): StockStruct;
  CalcDPE(r: number): StockStruct;
  CalcDPER(): StockStruct;
}

export class Stock implements StockStruct {
  Enterprise?: Enterprise[] | undefined;
  CurrentInfo?: CurrentInfo | undefined;
  PB?: number | undefined;
  PE?: number | undefined;
  PEG?: number | undefined;
  ROE?: number | undefined;
  DPE?: number | undefined;
  DPER?: number | undefined;
  DCE?: number | undefined;
  DCER?: number | undefined;
  AAGR?: number | undefined;
  Grade?: number | undefined;
  // Calc 计算全部基本属性
  Calc(): StockStruct {
    return this.CalcPB()
      .CalcPE()
      .CalcAAGR()
      .CalcPEG()
      .CalcROE();
  }
  // Discount 估值
  Discount(r: number): StockStruct {
    return this.CalcDCE(r)
      .CalcDCER()
      .CalcDPE(r)
      .CalcDPER();
  }
  // CalcPB 计算市净率
  CalcPB(): StockStruct {
    //市净率 = 股价 / 每股净资产
    this.PB = Number(this.CurrentInfo?.currentPrice) /
      Number(this.Enterprise?.[0].Bps);
    return this;
  }
  // CalcPE 计算市盈率
  CalcPE(): StockStruct {
    // 市盈率 = 股价 / 每股未分配利润
    this.PE = Number(this.Enterprise?.[0]?.Mgwfplr) /
      Number(this.CurrentInfo?.currentPrice);
    return this;
  }
  // CalcAAGR 计算平均年增长率
  CalcAAGR(): StockStruct {
    const len = Number(this.Enterprise?.length);
    let sum: number = 0;

    for (let k = 0; k < len; ++k) {
      const n = k + 1;
      if (n >= len) {
        break;
      }
      const lastBps = Number(this?.Enterprise?.[n]?.Bps);
      const Bps = Number(this?.Enterprise?.[k]?.Bps);

      const curAAGR = (Bps - lastBps) / lastBps;

      sum += curAAGR;
    }
    this.AAGR = sum / len;

    return this;
  }
  // CalcPEG 计算市盈增长比
  CalcPEG(): StockStruct {
    // 市盈增长比 = 市盈率 / 平均年增长率
    this.PEG = Number(this?.PE) / Number(this?.AAGR);
    return this;
  }
  // CalcROE 计算净资产收益率
  CalcROE(): StockStruct {
    // 净资产收益率 = 每股净值 / 每股未分配利润
    this.ROE = Number(this?.Enterprise?.[0]?.Mgwfplr) /
      Number(this?.Enterprise?.[0]?.Bps);
    return this;
  }
  // CalcDCE 计算动态现金估值
  CalcDCE(r: number): StockStruct {
    // 动态现金估值 = 每股经营现金流 / (贴现率 - 平均年增长率)
    this.DCE = Number(this?.Enterprise?.[0]?.Mgjyxjje) /
      (r - Number(this.AAGR));
    return this;
  }
  // CalcDCER 估值现值比
  CalcDCER(): StockStruct {
    this.DCER = Number(this?.DCE) / Number(this?.CurrentInfo?.currentPrice);
    return this;
  }
  // CalcDPE 计算动态利润估值
  CalcDPE(r: number): StockStruct {
    // 动态利润估值 = 每股净资产 / (贴现率 - 平均年增长率)
    this.DPE = Number(this?.Enterprise?.[0].Bps) / (r - Number(this?.AAGR));
    return this;
  }
  // CalcDPER 估值现值比
  CalcDPER(): StockStruct {
    this.DPER = Number(this?.DPE) / Number(this?.CurrentInfo?.currentPrice);
    return this;
  }
}

const StockModal: ModalSchma = {
  state: {
    listDate: [],
    enterpriseList: [],
    currentList: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *listEnterprise(_, { put }) {
      try {
        const a = sessionStorage.getItem("enterprise");
        if (a) {
          const enterprise = JSON.parse(a);
          yield put({ type: "save", payload: { enterpriseList: enterprise } });
          return enterprise;
        } else {
          const { data } = yield RESTful.get(
            "/main/enterprise/list",
            { silence: "success" },
          );
          sessionStorage.setItem("enterprise", JSON.stringify(data));
          yield put({ type: "save", payload: { enterpriseList: data } });
          return data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    *fetchEnterprise(_, { put }) {
      try {
        const { data } = yield RESTful.get(
          "/main/enterprise/fetch",
          { silence: "success", timeout: 0 },
        );
        sessionStorage.setItem("enterprise", JSON.stringify(data));
        yield put({ type: "save", payload: { enterpriseList: data } });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *listCurrent({ payload }, { put }) {
      try {
        const a = sessionStorage.getItem(`currrent-${payload}`);
        if (a) {
          const current = JSON.parse(a);
          yield put({ type: "save", payload: { currentList: current } });
          return current;
        } else {
          const { data } = yield RESTful.get(
            `/main/current-info/list/${payload}`,
            { silence: "success" },
          );
          sessionStorage.setItem(`currrent-${payload}`, JSON.stringify(data));
          yield put({ type: "save", payload: { currentList: data } });
          return data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    *fetchCurrent(_, { put }) {
      try {
        const { data } = yield RESTful.get(
          "/main/current-info/fetch",
          { silence: "success", timeout: 0 },
        );
        const date: InfoTime[] = yield put({ type: "listInfoTime" });
        sessionStorage.setItem(`currrent-${date[0]._id}`, JSON.stringify(data));
        yield put({ type: "save", payload: { currentList: data } });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *listInfoTime(_, { put }) {
      const { data } = yield RESTful.get(
        "/main/current-time/list",
        { silence: "success" },
      );
      yield put({ type: "save", payload: { listDate: data } });
      return data;
    },
  },
  subscriptions: {
    setup({ dispatch }): void {
      dispatch({ type: "listInfoTime" });
      dispatch({ type: "listEnterprise" });
    },
  },
};

export default StockModal;
