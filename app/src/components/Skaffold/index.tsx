import Taro, {
  FunctionComponent,
  useState,
  useEffect,
  createContext
} from "@tarojs/taro";
import { View } from "@tarojs/components";
import NavigationBar from "../NavigationBar/index";

/**
 * 小程序标题栏高度
 */
const TITLE_BAR_HEIGHT = 44;

interface Props {
  navigationBarTitleText: string;
  children?: any;
}

export interface SkaffoldContextValues {
  titleBarHeight: number;
  statusBarHeight: number;
}

export const SkaffoldContext = createContext<SkaffoldContextValues>({
  statusBarHeight: 0,
  titleBarHeight: 0
});

export const Skaffold: FunctionComponent<Props> = props => {
  const [statusBarHeight, setStatusBarHeight] = useState<number>();
  useEffect(() => {
    Taro.getSystemInfo().then(info => {
      setStatusBarHeight(info.statusBarHeight);
    });
  }, []);

  if (!statusBarHeight) {
    return null;
  }

  return (
    <SkaffoldContext.Provider
      value={{ statusBarHeight, titleBarHeight: TITLE_BAR_HEIGHT }}
    >
      <NavigationBar
        navigationBarTitleText={props.navigationBarTitleText}
        statusBarHeight={statusBarHeight}
        titleBarHeight={TITLE_BAR_HEIGHT}
      />

      <View
        style={{
          marginTop: `${statusBarHeight + TITLE_BAR_HEIGHT}px`
        }}
      >
        {props.children}
      </View>
    </SkaffoldContext.Provider>
  );
};

export default Skaffold;
