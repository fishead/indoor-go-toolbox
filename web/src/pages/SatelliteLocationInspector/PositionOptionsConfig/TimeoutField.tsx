import React, { FC, useState, useCallback } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import style from "./field.module.css";

type TimeoutValueTypeType = "default" | "positive-infinity" | "custom";

const maximumAgeValueTypeValues: TimeoutValueTypeType[] = [
  "custom",
  "positive-infinity",
  "default"
];

export interface Props {
  onChange: (v: PositionOptions["timeout"]) => void;
  defaultValueType?: TimeoutValueTypeType;
  defaultValue?: PositionOptions["timeout"];
}

export const TimeoutField: FC<Props> = props => {
  const [valueType, setValueType] = useState<TimeoutValueTypeType>(
    props.defaultValueType || "custom"
  );

  const [formattedValue, setFormattedValue] = useState(props.defaultValue);

  const [inputValue, setInputValue] = useState<string>(
    props.defaultValue !== undefined ? props.defaultValue.toString() : ""
  );

  const handleValueTypeChange: SelectProps["onChange"] = useCallback(
    evt => {
      const vt = evt.target.value as TimeoutValueTypeType;
      switch (vt) {
        case "custom":
          props.onChange(formattedValue);
          break;

        case "positive-infinity":
          props.onChange(Number.POSITIVE_INFINITY);
          break;

        case "default":
        default:
          props.onChange(undefined);
          break;
      }
      setValueType(vt);
    },
    [formattedValue, props]
  );

  const handleValueChange: TextFieldProps["onChange"] = useCallback(
    evt => {
      const s = evt.target.value;
      const n = Number.parseFloat(s);
      if (!Number.isNaN(n)) {
        props.onChange(n);
        setFormattedValue(n);
      }
      setInputValue(s);
    },
    [props]
  );

  return (
    <div className={style.container}>
      <FormControl className={style.left}>
        <InputLabel htmlFor="timeout">Timeout</InputLabel>
        <Select
          value={valueType}
          onChange={handleValueTypeChange}
          input={<Input id="timeout" value={valueType} />}
        >
          {maximumAgeValueTypeValues.map(opt => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={style.right}>
        <TextField
          type="number"
          label="Custom"
          value={inputValue}
          onChange={handleValueChange}
          disabled={valueType !== "custom"}
        />
      </FormControl>
    </div>
  );
};

export default TimeoutField;
