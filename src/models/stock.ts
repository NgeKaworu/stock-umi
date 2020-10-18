import { ModalSchma } from "@/models/global";

import { RESTful } from "@/http";

export interface InfoTime {
  _id: string;
}

export interface Enterprise {
  "id": string;
  "CreateDate": string;
  "code": string;
  "ReportDate": string;
  "Title": string;
  "Epsjb": string;
  "Epskcjb": string;
  "Epsxs": string;
  "Bps": string;
  "Mgzbgj": string;
  "Mgwfplr": string;
  "Mgjyxjje": string;
  "Totalincome": string;
  "Grossprofit": string;
  "Parentnetprofit": string;
  "Bucklenetprofit": string;
  "Totalincomeyoy": string;
  "Parentnetprofityoy": string;
  "Bucklenetprofityoy": string;
  "Totalincomerelativeratio": string;
  "Parentnetprofitrelativeratio": string;
  "Bucklenetprofitrelativeratio": string;
  "Roejq": string;
  "Roekcjq": string;
  "Allcapitalearningsrate": string;
  "Grossmargin": string;
  "Netinterest": string;
  "Accountsrate": string;
  "Salesrate": string;
  "Operatingrate": string;
  "Taxrate": string;
  "Liquidityratio": string;
  "Quickratio": string;
  "Cashflowratio": string;
  "Assetliabilityratio": string;
  "Equitymultiplier": string;
  "Equityratio": string;
  "Totalassetsdays": string;
  "Inventorydays": string;
  "Accountsreceivabledays": string;
  "Totalassetrate": string;
  "Inventoryrate": string;
  "Accountsreceiveablerate": string;
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
  Calc(): StockStruct {
    throw new Error("Method not implemented.");
  }
  Discount(r: number): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcPB(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcPE(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcAAGR(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcPEG(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcROE(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcDCE(r: number): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcDCER(): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcDPE(r: number): StockStruct {
    throw new Error("Method not implemented.");
  }
  CalcDPER(): StockStruct {
    throw new Error("Method not implemented.");
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
