import Taro, { FunctionComponent, useCallback, useState } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtButton, AtSwitch, AtFloatLayout } from "taro-ui";
import Skaffold from "../../../components/Skaffold/index";

type Beacon = {
  uuid: string;
  major: number;
  minor: number;
  rssi: number;
};

interface Result {
  timestamp: number;
  min_rssi: Beacon["rssi"];
  max_rssi: Beacon["rssi"];
  beacons: Beacon[];
}

type ScanningState =
  | "free"
  | "beacon_scanning_starting"
  | "beacon_scanning"
  | "beacon_scanning_stopping"
  | "bluetooth_scanning_starting"
  | "bluetooth_scanning"
  | "bluetooth_scanning_stopping";

const BluetoothInspector: FunctionComponent = () => {
  const [beaconUuids] = useState<string[]>([
    "F0F0C1C1-0001-0000-00FF-FFFF0A020000",
    "F0F0C1C1-0001-0000-00FF-FFFF0A030000"
  ]);
  const [checkedUuids, setCheckedUuids] = useState<string[]>([
    "F0F0C1C1-0001-0000-00FF-FFFF0A020000",
    "F0F0C1C1-0001-0000-00FF-FFFF0A030000"
  ]);

  const [results, setResults] = useState<Result[]>([]);
  const [scanningState, setScanningState] = useState<ScanningState>("free");

  const addResult = useCallback((beacons: Beacon[]) => {
    if (!beacons.length) {
      return;
    }

    const rssis = beacons.map(beacon => beacon.rssi);
    setResults(_results =>
      [
        {
          timestamp: Date.now(),
          min_rssi: Math.min(...rssis),
          max_rssi: Math.max(...rssis),
          beacons
        },
        ..._results
      ].slice(0, 100)
    );
  }, []);

  const startBluetoothDiscovery = useCallback(
    async (uuids: string[]) => {
      setScanningState("bluetooth_scanning_starting");
      const formattedUuids = uuids.map(uuid => uuid.toUpperCase());
      Taro.onBluetoothDeviceFound(evt => {
        const devices = evt.devices;

        const beacons = devices
          .map(device => {
            const advertisement = ab2hex(device.advertisData).toUpperCase();
            return {
              device,
              advertisement
            };
          })
          .filter(({ advertisement }) => advertisement.startsWith("4C000215"))
          .map(({ device, advertisement }) => {
            const uuid1 = advertisement.substr(8, 8);
            const uuid2 = advertisement.substr(16, 4);
            const uuid3 = advertisement.substr(20, 4);
            const uuid4 = advertisement.substr(24, 4);
            const uuid5 = advertisement.substr(28, 12);
            const uuid = [uuid1, uuid2, uuid3, uuid4, uuid5]
              .join("-")
              .toUpperCase();
            const major = Number.parseInt(advertisement.substr(40, 4), 16);
            const minor = Number.parseInt(advertisement.substr(44, 4), 16);
            const rssi = device.RSSI;

            return {
              uuid,
              major,
              minor,
              rssi
            };
          })
          .filter(beacon => formattedUuids.includes(beacon.uuid));
        addResult(beacons);
      });
      await Taro.openBluetoothAdapter();
      await Taro.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: true
      });
      setScanningState("bluetooth_scanning");
    },
    [addResult]
  );

  const stopBluetoothDiscovery = useCallback(async () => {
    setScanningState("bluetooth_scanning_stopping");
    await Taro.stopBluetoothDevicesDiscovery();
    setScanningState("free");
  }, []);

  const startBeaconDiscovery = useCallback(
    async (uuids: string[]) => {
      setScanningState("beacon_scanning_starting");
      Taro.onBeaconUpdate(evt => {
        const beacons = evt.beacons.map(beacon => {
          return {
            ...beacon,
            uuid: beacon.uuid.toUpperCase(),
            major: Number.parseInt(beacon.major, 10),
            minor: Number.parseInt(beacon.minor, 10)
          };
        });
        addResult(beacons);
      });
      await Taro.startBeaconDiscovery({
        uuids
      });
      setScanningState("beacon_scanning");
    },
    [addResult]
  );

  const stopBeaconDiscovery = useCallback(async () => {
    setScanningState("beacon_scanning_stopping");
    await Taro.stopBeaconDiscovery();
    setScanningState("free");
  }, []);

  const [viewResult, setViewResult] = useState<Result | undefined>();

  return (
    <Skaffold>
      {beaconUuids.map(uuid => (
        <AtSwitch
          key={uuid}
          title={uuid}
          checked={checkedUuids.includes(uuid)}
          onChange={enabled =>
            setCheckedUuids(_checkedUuids =>
              enabled
                ? [..._checkedUuids, uuid]
                : _checkedUuids.filter(_uuid => _uuid !== uuid)
            )
          }
        />
      ))}

      <View
        className="at-row at-row__justify--around"
        style={{ marginTop: "10px" }}
      >
        <View className="at-col at-col-5">
          <AtButton
            type="secondary"
            loading={scanningState === "beacon_scanning"}
            disabled={[
              "beacon_scanning_starting",
              "beacon_scanning_stopping",
              "bluetooth_scanning_starting",
              "bluetooth_scanning",
              "bluetooth_scanning_stopping"
            ].includes(scanningState)}
            onClick={() =>
              scanningState === "beacon_scanning"
                ? stopBeaconDiscovery()
                : startBeaconDiscovery(beaconUuids)
            }
          >
            {scanningState === "beacon_scanning" ? "停止" : "启动"} iBeacon 扫描
          </AtButton>
        </View>
        <View className="at-col at-col-5">
          <AtButton
            type="secondary"
            loading={scanningState === "bluetooth_scanning"}
            disabled={[
              "beacon_scanning_starting",
              "beacon_scanning",
              "beacon_scanning_stopping",
              "bluetooth_scanning_starting",
              "bluetooth_scanning_stopping"
            ].includes(scanningState)}
            onClick={() =>
              scanningState === "bluetooth_scanning"
                ? stopBluetoothDiscovery()
                : startBluetoothDiscovery(beaconUuids)
            }
          >
            {scanningState === "bluetooth_scanning" ? "停止" : "启动"} Bluetooth
            扫描
          </AtButton>
        </View>
      </View>

      <ScrollView>
        {results.map(result => {
          const timestamp = new Date(result.timestamp);
          const time = `${timestamp
            .getHours()
            .toString()
            .padStart(2, "0")}:${timestamp
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${timestamp
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
          const amount = result.beacons.length.toString().padStart(2, "0");
          const rssiRange = `${result.min_rssi} ~ ${result.max_rssi}`;
          return (
            <View key={result.timestamp} className="at-row">
              <View className="at-col at-col-4">time: {time}</View>
              <View className="at-col at-col-3">amount: {amount}</View>
              <View className="at-col at-col-3">rssi: {rssiRange}</View>
              <View className="at-col at-col-2">
                <AtButton
                  type="secondary"
                  size="small"
                  onClick={() => setViewResult(result)}
                >
                  查看
                </AtButton>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {viewResult && (
        <AtFloatLayout
          isOpened
          title={getTime(new Date(viewResult.timestamp))}
          onClose={() => setViewResult(undefined)}
        >
          {viewResult.beacons.map(beacon => (
            <View
              key={`${viewResult.timestamp}:${beacon.uuid}:${beacon.major}:${beacon.minor}`}
              style={{
                marginTop: "5px",
                backgroundColor: "hsla(0, 0%, 0%, 0.05)"
              }}
            >
              <View>rssi: {beacon.rssi}</View>
              <View>major: {beacon.major}</View>
              <View>minor: {beacon.minor}</View>
              <View>uuid: {beacon.uuid}</View>
            </View>
          ))}
        </AtFloatLayout>
      )}
    </Skaffold>
  );
};

export default BluetoothInspector;

function ab2hex(buffer: ArrayBuffer): string {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit: number) => ("00" + bit.toString(16)).slice(-2)
  );
  return hexArr.join("");
}

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
