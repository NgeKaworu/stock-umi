import { ModalSchma } from "@/models/global";
import { RESTful } from "@/http";

export interface UserSchema {
  id?: string;
  name?: string;
  email?: string;
  createAt?: Date;
  pwd?: string;
}

const UserModal: ModalSchma = {
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *login({ payload }) {
      const { data } = yield RESTful.post("/main/login", { data: payload });
      localStorage.setItem("token", data);
    },
    *logout() {
      localStorage.clear();
    },
  },
  subscriptions: {},
};

export default UserModal;
