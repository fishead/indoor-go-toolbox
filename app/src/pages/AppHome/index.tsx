import Taro, {
  FunctionComponent,
  useState,
  useTabItemTap,
  useCallback
} from "@tarojs/taro";
import { AtButton } from "taro-ui";
import Skaffold from "../../components/Skaffold";
import NetworkInspector from "./NetworkInspector";
import GPSInspector from "./SatelliteLocationInspector";
import BluetoothInspector from "./BluetoothInspector";

interface AppPageRoute {
  text: string;
  pagePath: string;
}

const BluetoothInspectorRoute: AppPageRoute = {
  text: "蓝牙测试",
  pagePath: "/pages/AppHome/BluetoothInspector/index"
};

const SatelliteLocationInspectorRoute: AppPageRoute = {
  text: "卫星定位测试",
  pagePath: "/pages/AppHome/SatelliteLocationInspector/index"
};

const NetworkInspectorRoute: AppPageRoute = {
  text: "网络测试",
  pagePath: "/pages/AppHome/NetworkInspector/index"
};

const routes: AppPageRoute[] = [
  BluetoothInspectorRoute,
  NetworkInspectorRoute,
  SatelliteLocationInspectorRoute
];

const AppHome: FunctionComponent = () => {
  const [selectedRoute, setSelectedRoute] = useState<AppPageRoute | null>(null);

  const handleSelectMenu = useCallback((route: AppPageRoute | null) => {
    Taro.setNavigationBarTitle({
      title: route ? route.text : "IndoorGo toolbox"
    });
    setSelectedRoute(route);
  }, []);

  useTabItemTap(() => {
    handleSelectMenu(null);
  });

  if (
    selectedRoute &&
    selectedRoute.pagePath === BluetoothInspectorRoute.pagePath
  ) {
    return (
      <Skaffold>
        <BluetoothInspector />
      </Skaffold>
    );
  }

  if (
    selectedRoute &&
    selectedRoute.pagePath === NetworkInspectorRoute.pagePath
  ) {
    return (
      <Skaffold>
        <NetworkInspector />
      </Skaffold>
    );
  }

  if (
    selectedRoute &&
    selectedRoute.pagePath === SatelliteLocationInspectorRoute.pagePath
  ) {
    return (
      <Skaffold>
        <GPSInspector />
      </Skaffold>
    );
  }

  return (
    <Skaffold>
      {routes.map((route, index) => (
        <AtButton
          key={route.pagePath}
          type="secondary"
          customStyle={Object.assign(
            { marginLeft: "20px", marginRight: "20px" },
            index > 0 ? { marginTop: "10px" } : undefined
          )}
          onClick={() => handleSelectMenu(route)}
        >
          {route.text}
        </AtButton>
      ))}
    </Skaffold>
  );
};

export default AppHome;
