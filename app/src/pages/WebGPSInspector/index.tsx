import Taro, { FunctionComponent } from "@tarojs/taro";
import { WebView } from "@tarojs/components";

const WebGPSInspector: FunctionComponent = () => {
  return (
    <WebView src="https://cdn.jcbel.com/indoor-go-apps/indoor-go-toolbox/0.5.0/index.html#/gps/inspector" />
  );
};

export default WebGPSInspector;
