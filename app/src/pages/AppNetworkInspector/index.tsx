import Taro, {
  FunctionComponent,
  useCallback,
  useState,
  useContext,
  useMemo
} from "@tarojs/taro";
import { View, ScrollView, Picker, Label } from "@tarojs/components";
import { AtButton, AtInputNumber, AtMessage } from "taro-ui";
import { defer, from, EMPTY, range, of, Subject } from "rxjs";
import {
  finalize,
  catchError,
  tap,
  mergeMap,
  concatMap,
  delay,
  takeUntil
} from "rxjs/operators";
import nanoid from "nanoid/non-secure";
import Skaffold, { SkaffoldContext } from "../../components/Skaffold/index";

interface Result {
  id: number;
  seq: number;
  start_at: number;
  finish_at: number;
  time_cost: number;
  status_code: number;
}

type ScanningState = "free" | "processing";

type Mode = "sequence" | "concurrence";
const modes: Mode[] = ["sequence", "concurrence"];

interface FloodServerOptions {
  mode: Mode;
  count: number;
  interval: number;
  timeout: number;
}

const uniqueId = (() => {
  let counter = 1;
  return () => {
    return counter++;
  };
})();

const AppNetworkInspector: FunctionComponent = () => {
  const [requestMode, setRequestMode] = useState<Mode>("sequence");
  const [requestCount, setRequestCount] = useState<number>(1);
  const [requestInterval, setRequestInterval] = useState<number>(1000);
  const [requestTimeout, setRequestTimeout] = useState<number>(500);
  const [requestState, setRequestState] = useState<ScanningState>("free");
  const [results, setResults] = useState<Result[]>([]);
  const stopSignal$ = useMemo(() => new Subject<number>(), []);

  const floodServer = useCallback(
    (options: FloodServerOptions) => {
      const { mode, count, interval: _interval, timeout: _timeout } = options;
      // AtInputNumber onChange 事件返回的实际上是 string 类型
      // https://github.com/NervJS/taro-ui/issues/726
      const _count = Number.parseInt(count as any, 10);
      if (mode === "concurrence" && _count > 100) {
        Taro.atMessage({
          message: "can not send more than 100 reequests in concurrence mode",
          type: "warning"
        });
        return;
      }

      const session = nanoid();
      setRequestState("processing");

      range(1, _count)
        .pipe(
          concatMap((n, index) => {
            return of(n).pipe(
              delay(mode === "concurrence" || index === 0 ? 0 : _interval)
            );
          }),
          mergeMap(n => {
            return defer(() => {
              const startAt = Date.now();
              const url = `https://beacon-p2p.jcmap.jcbel.com/?type=push&session=${session}`;
              const data =
                Date.now() +
                "/" +
                "F0F0C1C1-0001-0000-00FF-FFFF0A020000:F0F0C1C1-0001-0000-00FF-FFFF0A030000|0|8675:6707:8078:8338:6576:7226:6374:8193:8778:8588:6600:6373:4434:7894:6609:7147:6909:8619:7908:8915:1235:8750:8770:6386:7188:8649:6619:508:8036:6881:8567:8068:8827:6574:319:8421:8793:447:7100:8849:7224:8304:7229:6201:3391:8425:3732:874:1028:7236:4616:8110|-79:-87:-81:-80:-82:-85:-83:-91:-73:-88:-84:-76:-86:-78:-90:-72:-92||0:0:0:0|0:0:1:1|0:0:2:2|0:0:3:3|0:0:4:4|0:0:5:1|0:0:6:2|0:0:7:5|0:0:8:3|0:0:9:6|0:0:10:7|0:0:11:4|0:0:12:8|0:0:13:2|0:0:14:3|0:0:15:9|0:0:16:10|0:0:17:3|0:0:18:2|0:0:19:5|1:0:20:11|0:0:21:12|0:0:22:12|0:0:23:0|0:0:24:4|0:0:25:4|0:0:26:13|1:0:27:4|0:0:28:2|0:0:29:3|0:0:30:11|0:0:31:4|0:0:32:12|0:0:33:14|1:0:34:15|0:0:35:12|0:0:36:7|1:0:37:10|0:0:38:9|0:0:39:10|0:0:40:2|0:0:41:5|0:0:42:16|0:0:43:10|1:0:44:7|0:0:45:1|1:0:46:7|1:0:47:13|1:0:48:3|0:0:49:14|0:0:50:10|0:0:51:1";
              const header = {
                "content-type": "text/plain"
              };
              const requestParams: Taro.request.Param<string> = {
                url,
                data,
                header,
                method: "POST",
                timeout: _timeout
              };

              return from(Promise.resolve(Taro.request(requestParams))).pipe(
                tap(res => {
                  const now = Date.now();
                  setResults(_results =>
                    [
                      {
                        id: uniqueId(),
                        seq: n,
                        start_at: startAt,
                        finish_at: now,
                        time_cost: now - startAt,
                        status_code: res.statusCode
                      },
                      ..._results
                    ].slice(0, 100)
                  );
                }),
                catchError(err => {
                  const now = Date.now();
                  setResults(_results =>
                    [
                      {
                        id: uniqueId(),
                        seq: n,
                        start_at: startAt,
                        finish_at: now,
                        time_cost: now - startAt,
                        status_code: err.statusCode
                      },
                      ..._results
                    ].slice(0, 100)
                  );
                  return EMPTY;
                })
              );
            });
          }),
          takeUntil(stopSignal$),
          finalize(() => {
            setRequestState("free");
          })
        )
        .subscribe({
          error: err => {
            console.error("stream error", err);
          }
        });
    },
    [setRequestState, setResults, stopSignal$]
  );

  const { statusBarHeight, titleBarHeight } = useContext(SkaffoldContext);

  return (
    <Skaffold navigationBarTitleText="网络测试">
      <View className="at-row at-row--wrap">
        <View className="at-col at-col-12">
          <Picker
            mode="selector"
            range={modes}
            value={modes.indexOf(requestMode)}
            onChange={evt => setRequestMode(modes[evt.detail.value])}
          >
            <View className="picker">请求模式：{requestMode}</View>
          </Picker>
        </View>

        <View className="at-col at-col-12">
          <Label>
            请求次数：
            <AtInputNumber
              type="number"
              max={999}
              step={1}
              value={requestCount}
              onChange={value => setRequestCount(value)}
            />
          </Label>
        </View>

        {requestMode === "sequence" && requestCount > 1 && (
          <View className="at-col at-col-12">
            <Label>
              间隔时间：
              <AtInputNumber
                type="number"
                max={99999}
                step={1}
                value={requestInterval}
                onChange={value => setRequestInterval(value)}
              />
            </Label>
          </View>
        )}

        <View className="at-col at-col-12">
          <Label>
            超时时间：
            <AtInputNumber
              type="number"
              max={99999}
              step={1}
              value={requestTimeout}
              onChange={value => setRequestTimeout(value)}
            />
          </Label>
        </View>
      </View>

      <View
        className="at-row at-row__justify--around"
        style={{ marginTop: "10px" }}
      >
        <View className="at-col at-col-5">
          <AtButton
            type="secondary"
            loading={requestState === "processing"}
            onClick={() =>
              requestState === "processing"
                ? stopSignal$.next(Date.now())
                : floodServer({
                    mode: requestMode,
                    count: requestCount,
                    interval: requestInterval,
                    timeout: requestTimeout
                  })
            }
          >
            {requestState === "processing" ? "Stop Flood" : "Flood Server"}
          </AtButton>
        </View>
      </View>

      <ScrollView>
        {results.map(result => {
          const startAt = getTime(new Date(result.start_at));
          const finishAt = getTime(new Date(result.finish_at));

          return (
            <View
              key={result.id}
              className="at-row at-row--wrap"
              style={{
                marginTop: "10px",
                backgroundColor:
                  result.status_code !== 204 ? "cornsilk" : "white"
              }}
            >
              <View className="at-col at-col-6">task_id: {result.id}</View>
              <View className="at-col at-col-6">sequence: {result.seq}</View>
              <View className="at-col at-col-6">start_at: {startAt}</View>
              <View className="at-col at-col-6">start_at: {startAt}</View>
              <View className="at-col at-col-6">finish_at: {finishAt}</View>
              <View className="at-col at-col-6">
                time_cost: {result.time_cost}
              </View>
              <View className="at-col at-col-6">
                status_code: {result.status_code}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <AtMessage
        customStyle={{ marginTop: `${statusBarHeight + titleBarHeight}px` }}
      />
    </Skaffold>
  );
};

export default AppNetworkInspector;

function getTime(datetime: Date) {
  const hours = datetime
    .getHours()
    .toString()
    .padStart(2, "0");
  const minutes = datetime
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const seconds = datetime
    .getSeconds()
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
