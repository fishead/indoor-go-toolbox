import Taro, {
  FunctionComponent,
  useState,
  useTabItemTap,
  useCallback
} from "@tarojs/taro";
import { AtButton } from "taro-ui";
import { WebView } from "@tarojs/components";
import Skaffold from "../../components/Skaffold";

interface WebPageRoute {
  text: string;
  pagePath: string;
}

const AccelerationInspectorRoute: WebPageRoute = {
  text: "加速度测试",
  pagePath:
    "https://cdn.jcbel.com/indoor-go-apps/indoor-go-toolbox/0.7.0/index.html#/acceleration-inspector"
};

const SatelliteLocationInspectorRoute: WebPageRoute = {
  text: "卫星定位测试",
  pagePath:
    "https://cdn.jcbel.com/indoor-go-apps/indoor-go-toolbox/0.7.0/index.html#/satellite-location-inspector"
};

const routes: WebPageRoute[] = [
  AccelerationInspectorRoute,
  SatelliteLocationInspectorRoute
];

const WebHome: FunctionComponent = () => {
  const [selectedRoute, setSelectedRoute] = useState<WebPageRoute | null>(null);

  const handleSelectMenu = useCallback((route: WebPageRoute | null) => {
    Taro.setNavigationBarTitle({
      title: route ? route.text : "IndoorGo toolbox"
    });
    setSelectedRoute(route);
  }, []);

  useTabItemTap(() => {
    handleSelectMenu(null);
  });

  if (selectedRoute) {
    return (
      <Skaffold>
        <WebView src={selectedRoute.pagePath} />
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

export default WebHome;
