import "@tarojs/async-await";
import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
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
    pages: ["pages/AppHome/index", "pages/WebHome/index"],
    window: {
      navigationStyle: "default",
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "IndoorGo toolbox",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      list: [
        {
          text: "小程序",
          pagePath: "pages/AppHome/index"
        },
        {
          text: "浏览器",
          pagePath: "pages/WebHome/index"
        }
      ]
    }
  };

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <View></View>;
  }
}

Taro.render(<App />, document.getElementById("app"));
