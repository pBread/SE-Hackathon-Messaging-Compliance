import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface State {
  gpt: { [key: string]: {} };
  isAnalyzed: boolean;
  isFetching: boolean;

  items: { [key: string]: MessageRecord };
}

export type SetState = Dispatch<SetStateAction<State>>;

export const StateContext = createContext<{ state: State; setState: SetState }>(
  {
    state: { items: {}, gpt: {}, isAnalyzed: false, isFetching: false },
    setState: () => {},
  }
);

export function useAppState() {
  const data = useContext(StateContext);

  return data.state;
}

export function useSetState() {
  const data = useContext(StateContext);

  return data.setState;
}

export interface MessageRecord {
  AccountSid: string;
  ApiVersion: string;
  Body: string;
  Direction: string;
  ErrorCode: string;
  From: string;
  NumSegments: string;
  Price: string;
  PriceUnit: string;
  SentDate: string;
  Sid: string;
  Status: string;
  To: string;
}
