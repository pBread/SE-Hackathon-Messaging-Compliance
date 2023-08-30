import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface State {
  gpt: { [key: string]: {} };
  items: { [key: string]: {} };
}

export type SetState = Dispatch<SetStateAction<State>>;

export const StateContext = createContext<{ state: State; setState: SetState }>(
  { state: { items: {}, gpt: {} }, setState: () => {} }
);

export function useStateContext() {
  const state = useContext(StateContext);

  return state;
}
