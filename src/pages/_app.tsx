import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { State, StateContext } from "@/state";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [state, setState] = useState<State>({
    items: {},
    gpt: {},
    isAnalyzed: false,
    isFetching: false,
  });

  return (
    <StateContext.Provider value={{ state, setState }}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </StateContext.Provider>
  );
}
