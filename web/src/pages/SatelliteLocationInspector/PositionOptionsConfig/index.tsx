import React, { FC } from "react";
import {
  EnableHighAccuracyField,
  Props as EnableHighAccuracyFieldProps
} from "./EnableHighAccuracyField";
import {
  MaximumAgeField,
  Props as MaximumAgeFieldProps
} from "./MaximumAgeField";
import { TimeoutField, Props as TimeoutFieldProps } from "./TimeoutField";
import style from "./index.module.css";
import { defaultState } from "../reducer";

interface Props {
  onEnableHighAccuracyChange: EnableHighAccuracyFieldProps["onChange"];
  onMaximumAgeChange: MaximumAgeFieldProps["onChange"];
  onTimeoutChange: TimeoutFieldProps["onChange"];
}

export const PositionOptionsConfig: FC<Props> = props => {
  return (
    <div className={style.container}>
      <EnableHighAccuracyField
        onChange={props.onEnableHighAccuracyChange}
        defaultValueType="custom"
        defaultValue={defaultState.positionOptions.enableHighAccuracy}
      />

      <MaximumAgeField
        onChange={props.onMaximumAgeChange}
        defaultValueType="custom"
        defaultValue={defaultState.positionOptions.maximumAge}
      />

      <TimeoutField
        onChange={props.onTimeoutChange}
        defaultValueType="custom"
        defaultValue={defaultState.positionOptions.timeout}
      />
    </div>
  );
};

export default PositionOptionsConfig;
