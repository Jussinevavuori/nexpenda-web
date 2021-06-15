import { useCallback, useMemo, useState } from "react";
import { useOnKeyPress } from "../../hooks/utils/useOnKeyPress";
import {
  Calculation,
  CalculatorFunction,
} from "../../utils/CalculatorUtils/Calculation";
import { CalculatorProps } from "./Calculator";

export function useCalculatorController(props: CalculatorProps) {
  /**
   * Internal calculation value
   */
  const initialValue = props.initialValue;
  const [calculation, setCalculation] = useState(() =>
    initialValue && Number.isFinite(initialValue)
      ? new Calculation(initialValue.toString())
      : new Calculation("")
  );

  // Get input and output from calculation
  const inputValue = useMemo(() => calculation.formatInput(), [calculation]);
  const outputValue = useMemo(() => calculation.value, [calculation]);

  // Handling input and submitting on equal sign
  const onSubmit = props.onSubmit;
  const handleInput = useCallback(
    (input: CalculatorFunction) => {
      if (input === "eql" && onSubmit) {
        onSubmit(calculation.value);
      } else {
        setCalculation((c) => c.input(input));
      }
    },
    [setCalculation, onSubmit, calculation]
  );

  // Utility function for key presses
  const inputCallback = useCallback(
    (fn: CalculatorFunction) => () => handleInput(fn),
    [handleInput]
  );

  // All keypresses for desktop use:

  // All numbers
  useOnKeyPress("1", inputCallback("no1"));
  useOnKeyPress("2", inputCallback("no2"));
  useOnKeyPress("3", inputCallback("no3"));
  useOnKeyPress("4", inputCallback("no4"));
  useOnKeyPress("5", inputCallback("no5"));
  useOnKeyPress("6", inputCallback("no6"));
  useOnKeyPress("7", inputCallback("no7"));
  useOnKeyPress("8", inputCallback("no8"));
  useOnKeyPress("9", inputCallback("no9"));
  useOnKeyPress("0", inputCallback("no0"));

  // Commas on both dot and comma
  useOnKeyPress(".", inputCallback("dot"));
  useOnKeyPress(",", inputCallback("dot"));

  // Operations
  useOnKeyPress("+", inputCallback("add"));
  useOnKeyPress("-", inputCallback("sub"));
  useOnKeyPress("/", inputCallback("div"));
  useOnKeyPress("*", inputCallback("mul"));

  // Clearing on c, backspace is backspace
  useOnKeyPress("c", inputCallback("clr"));
  useOnKeyPress("Backspace", inputCallback("bck"));

  // Submitting on "=" and Enter
  useOnKeyPress("=", inputCallback("eql"));
  useOnKeyPress("Enter", inputCallback("eql"));

  // P for single parenthesis, ( and ) for specified parenthesis
  useOnKeyPress("p", inputCallback("par"));
  useOnKeyPress("(", inputCallback("pro"));
  useOnKeyPress(")", inputCallback("prc"));

  return {
    isValid: calculation.isValid,
    inputValue,
    outputValue,
    handleInput,
  };
}
