import Taro, { FunctionComponent, useState, useEffect } from "@tarojs/taro";
import { View, Block } from "@tarojs/components";
import NavigationBar from "../NavigationBar/index";

/**
 * 小程序标题栏高度
 */
const TITLE_BAR_HEIGHT = 44;

interface Props {
  navigationBarTitleText: string;
  children?: any;
}

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
    <Block>
      <NavigationBar
        navigationBarTitleText={props.navigationBarTitleText}
        statusBarHeight={statusBarHeight}
      />

      <View
        style={{
          marginTop: `${statusBarHeight + TITLE_BAR_HEIGHT}px`
        }}
      >
        {props.children}
      </View>
    </Block>
  );
};

export default Skaffold;
