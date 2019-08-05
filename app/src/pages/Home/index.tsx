import Taro, { FunctionComponent } from "@tarojs/taro";
import { AtButton } from "taro-ui";
import Skaffold from "../../components/Skaffold";

const routes = [
  {
    name: "蓝牙测试",
    path: "/pages/BluetoothInspector/index"
  },
  {
    name: "小程序 GPS 定位测试",
    path: "/pages/AppGPSInspector/index"
  },
  {
    name: "浏览器 GPS 定位测试",
    path: "/pages/WebGPSInspector/index"
  },
  {
    name: "小程序网络测试",
    path: "/pages/AppNetworkInspector/index"
  }
];

const Home: FunctionComponent = () => {
  return (
    <Skaffold navigationBarTitleText="IndoorGo Toolbox">
      {routes.map((route, index) => (
        <AtButton
          key={route.path}
          type="secondary"
          customStyle={Object.assign(
            { marginLeft: "20px", marginRight: "20px" },
            index > 0 ? { marginTop: "10px" } : undefined
          )}
          onClick={() => Taro.navigateTo({ url: route.path })}
        >
          {route.name}
        </AtButton>
      ))}
    </Skaffold>
  );
};

export default Home;
