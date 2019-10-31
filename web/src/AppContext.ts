import { createContext } from "react";

export interface AppContextValues {
  jcmapToken?: string | null;
  setJcmapToken: (v: string) => void;
}

export const AppContext = createContext<AppContextValues>({
  setJcmapToken: () => {}
});
