import "@tarojs/async-await";
import Taro, { Component, Config } from "@tarojs/taro";
import Home from "./pages/Home";

import "./app.scss";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  config: Config = {
    pages: [
      "pages/Home/index",
      "pages/AppGPSInspector/index",
      "pages/AppNetworkInspector/index",
      "pages/BluetoothInspector/index",
      "pages/WebGPSInspector/index"
    ],
    window: {
      navigationStyle: "custom",
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    }
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Home />;
  }
}

Taro.render(<App />, document.getElementById("app"));
