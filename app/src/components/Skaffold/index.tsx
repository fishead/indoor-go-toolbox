import Taro, { FunctionComponent, createContext, useMemo } from "@tarojs/taro";
import { View } from "@tarojs/components";

interface Props {
  children?: any;
}

export interface SkaffoldContextValues {
  statusBarHeight: number;
}

export const SkaffoldContext = createContext<SkaffoldContextValues>({
  statusBarHeight: 0
});

export const Skaffold: FunctionComponent<Props> = props => {
  const statusBarHeight = useMemo<number>(
    () => Taro.getSystemInfoSync().statusBarHeight,
    []
  );

  return (
    <SkaffoldContext.Provider value={{ statusBarHeight }}>
      <View>{props.children}</View>
    </SkaffoldContext.Provider>
  );
};

export default Skaffold;
