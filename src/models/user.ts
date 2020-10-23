import { ModalSchma } from "@/models/global";
import { RESTful } from "@/http";

export interface UserSchema {
  id?: string;
  name?: string;
  email?: string;
  createAt?: Date;
}

const UserModal: ModalSchma = {
  state: {
    id: undefined,
    name: undefined,
    email: undefined,
    createAt: undefined,
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *login({ payload }) {
      const { data } = yield RESTful.post("/main/login", { data: payload });
      localStorage.setItem("stock-token", data);
    },
    *profile(_, { put }) {
      const { data } = yield RESTful.get(
        "/main/profile",
        { silence: "success" },
      );
      yield put({ type: "save", payload: data });
    },
    *logout(_, { put }) {
      localStorage.clear();
      yield put({ type: "save", payload: { id: undefined } });
    },
  },
  subscriptions: {
    setup({ dispatch }): void {
      dispatch({ type: "profile" });
    },
  },
};

export default UserModal;
