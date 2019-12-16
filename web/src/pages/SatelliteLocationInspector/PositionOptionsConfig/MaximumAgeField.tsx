import React, { FC, useState, useCallback } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import style from "./field.module.css";

type MaximumAgeValueTypeType = "default" | "positive-infinity" | "custom";

const maximumAgeValueTypeValues: MaximumAgeValueTypeType[] = [
  "custom",
  "positive-infinity",
  "default"
];

export interface Props {
  onChange: (v: PositionOptions["maximumAge"]) => void;
  defaultValueType?: MaximumAgeValueTypeType;
  defaultValue?: PositionOptions["maximumAge"];
}

export const MaximumAgeField: FC<Props> = props => {
  const [valueType, setValueType] = useState<MaximumAgeValueTypeType>(
    props.defaultValueType || "custom"
  );

  const [formattedValue, setFormattedValue] = useState(props.defaultValue);

  const [inputValue, setInputValue] = useState<string>(
    props.defaultValue !== undefined ? props.defaultValue.toString() : ""
  );

  const handleValueTypeChange: SelectProps["onChange"] = useCallback(
    evt => {
      const vt = evt.target.value as MaximumAgeValueTypeType;
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
    [props, formattedValue]
  );

  const handleValueChange: TextFieldProps["onChange"] = useCallback(
    evt => {
      const v = evt.target.value;
      const n = Number.parseFloat(v);
      if (!Number.isNaN(n)) {
        props.onChange(n);
        setFormattedValue(n);
      }
      setInputValue(v);
    },
    [props]
  );

  return (
    <div className={style.container}>
      <FormControl className={style.left}>
        <InputLabel htmlFor="maximum-age">Maximum Age</InputLabel>
        <Select
          value={valueType}
          onChange={handleValueTypeChange}
          input={<Input id="maximum-age" value={valueType} />}
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

export default MaximumAgeField;
