import React, { FC, useCallback, useState } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import style from "./field.module.css";

type EnableHighAccuracyValueTypeType = "default" | "custom";
type EnableHighAccuracyValueType = "true" | "false";

const enableHighAccuracyValueTypeValues: EnableHighAccuracyValueTypeType[] = [
  "default",
  "custom"
];
const enableHighAccuracyValuesValues: EnableHighAccuracyValueType[] = [
  "true",
  "false"
];

export interface Props {
  onChange: (v: PositionOptions["enableHighAccuracy"]) => void;
  defaultValueType?: EnableHighAccuracyValueTypeType;
  defaultValue?: PositionOptions["enableHighAccuracy"];
}

export const EnableHighAccuracyField: FC<Props> = props => {
  const [valueType, setValueType] = useState<EnableHighAccuracyValueTypeType>(
    props.defaultValueType || "custom"
  );

  const [formattedValue, setFormattedValue] = useState(props.defaultValue);

  const [inputValue, setInputValue] = useState<EnableHighAccuracyValueType>(
    props.defaultValue ? "true" : "false"
  );

  const handleValueTypeChange: SelectProps["onChange"] = useCallback(
    evt => {
      const vt = evt.target.value as EnableHighAccuracyValueTypeType;
      const v = vt === "custom" ? formattedValue : undefined;
      props.onChange(v);
      setValueType(vt);
    },
    [props, formattedValue]
  );

  const handleValueChange: SelectProps["onChange"] = useCallback(
    evt => {
      const s = evt.target.value as EnableHighAccuracyValueType;
      const v = s === "true" ? true : false;
      props.onChange(v);
      setInputValue(s);
      setFormattedValue(v);
    },
    [props]
  );

  return (
    <div className={style.container}>
      <FormControl className={style.left}>
        <InputLabel htmlFor="enable-high-accuracy-type">
          Enable High Accuracy
        </InputLabel>

        <Select
          value={valueType}
          onChange={handleValueTypeChange}
          input={<Input id="enable-high-accuracy-type" value={valueType} />}
        >
          {enableHighAccuracyValueTypeValues.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl style={{ width: "64%" }}>
        <InputLabel htmlFor="maximum-age">Custom</InputLabel>
        <Select
          value={inputValue}
          onChange={handleValueChange}
          input={<Input id="enable-high-accuracy" value={inputValue} />}
          disabled={valueType !== "custom"}
        >
          {enableHighAccuracyValuesValues.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default EnableHighAccuracyField;
