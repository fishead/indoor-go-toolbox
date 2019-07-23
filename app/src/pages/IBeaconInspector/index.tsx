import Taro, { FunctionComponent, useCallback } from "@tarojs/taro";
import { Text, Button } from "@tarojs/components";
import Skaffold from "../../components/Skaffold/index";

const IBeaconInspector: FunctionComponent = () => {
  const startScan = useCallback(() => {
    Taro.startBeaconDiscovery({
      uuids: []
    });
  }, []);

  return (
    <Skaffold navigationBarTitleText="iBeacon 测试工具">
      <Text>(WIP)iBeacon 测试工具</Text>
      <Button onClick={() => startScan()}>开始扫描</Button>
    </Skaffold>
  );
};

export default IBeaconInspector;
