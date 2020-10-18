import { ModalSchma } from "@/models/global";

import { RESTful } from "@/http";

export interface InfoTime {
  _id: string;
}

export interface Annals {
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

const TagModal: ModalSchma = {
  state: {
    listDate: [],
    annalsList: [],
    currentList: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *listAnnals(_, { put }) {
      try {
        const a = sessionStorage.getItem("annals");
        if (a) {
          const annals = JSON.parse(a);
          return yield put({ type: "save", payload: { annalsList: annals } });
        } else {
          const { data } = yield RESTful.get(
            "/main/annals/list",
            { silence: "success" },
          );
          sessionStorage.setItem("annals", JSON.stringify(data));
          return yield put({ type: "save", payload: { annalsList: data } });
        }
      } catch (e) {
        console.error(e);
      }
    },
    *fetchAnnals(_, { put }) {
      try {
        const { data } = yield RESTful.get(
          "/main/annals/fetch",
          { silence: "success", timeout: 0 },
        );
        sessionStorage.setItem("annals", JSON.stringify(data));
        return yield put({ type: "save", payload: { annalsList: data } });
      } catch (e) {
        console.error(e);
      }
    },
    *listCurrent({ payload }, { put }) {
      try {
        const a = sessionStorage.getItem(`currrent-${payload}`);
        if (a) {
          const annals = JSON.parse(a);
          return yield put({ type: "save", payload: { currentList: annals } });
        } else {
          const { data } = yield RESTful.get(
            `/main/current-info/list/${payload}`,
            { silence: "success" },
          );
          sessionStorage.setItem(`currrent-${payload}`, JSON.stringify(data));
          return yield put({ type: "save", payload: { currentList: data } });
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
        return yield put({ type: "save", payload: { annalsList: data } });
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
      dispatch({ type: "listAnnals" });
    },
  },
};

export default TagModal;
