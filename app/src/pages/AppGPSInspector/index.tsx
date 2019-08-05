import Taro, {
  FunctionComponent,
  useCallback,
  useState,
  useMemo
} from "@tarojs/taro";
import { View, Text, Button, Label, Picker } from "@tarojs/components";
import Skaffold from "../../components/Skaffold/index";

type LocationType = Taro.getLocation.Param["type"];

const AppGPSInspector: FunctionComponent = () => {
  const locationTypes = useMemo<LocationType[]>(() => ["gcj02", "wgs84"], []);
  const [locationType, setLocationType] = useState<LocationType>("gcj02");
  const getLocation = useCallback(() => {
    Taro.getLocation({
      type: locationType
    });
  }, [locationType]);

  return (
    <Skaffold navigationBarTitleText="小程序 GPS 定位测试">
      <Text>显示当前位置</Text>
      <Label>
        <Picker
          mode="selector"
          range={locationTypes as string[]}
          value={locationTypes.indexOf(locationType)}
          onChange={evt => {
            console.log(evt);
            setLocationType(evt.detail);
          }}
        >
          <View>{locationType}</View>
        </Picker>
      </Label>
      <Button onClick={() => getLocation()}>开始扫描</Button>
    </Skaffold>
  );
};

export default AppGPSInspector;
