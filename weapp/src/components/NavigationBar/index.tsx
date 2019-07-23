import Taro, { FunctionComponent } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

interface Props {
  statusBarHeight: number;
  navigationBarTitleText: string;
}

export const NavigationBar: FunctionComponent<Props> = ({
  navigationBarTitleText,
  statusBarHeight
}) => {
  return (
    <View
      style={{
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: `${statusBarHeight}px`,
        right: 0,
        left: 0
      }}
    >
      <View
        onClick={() => Taro.navigateTo({ url: "/pages/Home/index" })}
        style={{
          position: "absolute",
          left: 0,
          border: "1px solid grey"
        }}
      >
        <Text>Home</Text>
      </View>
      <Text>{navigationBarTitleText}</Text>
    </View>
  );
};

export default NavigationBar;
