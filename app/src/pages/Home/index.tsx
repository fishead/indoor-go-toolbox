import Taro, { FunctionComponent } from "@tarojs/taro";
import { Button } from "@tarojs/components";
import Skaffold from "../../components/Skaffold";

const routes = [
  {
    name: "IBeacon 测试",
    path: "/pages/IBeaconInspector/index"
  },
  {
    name: "小程序 GPS 定位测试",
    path: "/pages/WeappGPSInspector/index"
  },
  {
    name: "浏览器 GPS 定位测试",
    path: "/pages/WebGPSInspector/index"
  }
];

const Home: FunctionComponent = () => {
  return (
    <Skaffold navigationBarTitleText="IndoorGo Toolbox">
      {routes.map(route => (
        <Button
          key={route.path}
          onClick={() => Taro.navigateTo({ url: route.path })}
        >
          {route.name}
        </Button>
      ))}
    </Skaffold>
  );
};

export default Home;
