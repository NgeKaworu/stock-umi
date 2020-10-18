import { Subscription, Effect, Reducer } from "umi";

export interface ModalSchma {
  namespace?: string;
  state: Record<string, any>;
  effects: Record<string, Effect>;
  reducers: Record<string, Reducer>;
  subscriptions: Record<string, Subscription>;
}

const Global: ModalSchma = {
  state: {},
  effects: {},
  reducers: {},
  subscriptions: {},
};

export default Global;
