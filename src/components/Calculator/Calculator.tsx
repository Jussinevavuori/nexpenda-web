import "./Calculator.scss";
import React from "react";
import cx from "classnames";
import { useCalculatorController } from "./useCalculatorController";
import { Type } from "../Type/Type";
import { Backspace } from "@material-ui/icons";
import { useIsDarkTheme } from "../../hooks/application/useIsThemeMode";

export type CalculatorProps = {
	initialValue?: number;
	onSubmit?(value: number): void;
};

export function Calculator(props: CalculatorProps) {

	const controller = useCalculatorController(props)
	const isDarkTheme = useIsDarkTheme()

	return <div className={cx("Calculator")}>
		<div className={cx("display", { isValid: controller.isValid })}>
			<span className="input">
				<Type color={isDarkTheme ? "gray-400" : "gray-700"}>
					{controller.inputValue}
				</Type>
			</span>
			<span className="output">
				<Type color={isDarkTheme ? "gray-300" : "gray-800"} variant="bold">
					{Number.isNaN(controller.outputValue) ? "Error" : controller.outputValue}
				</Type>
			</span>
		</div>

		<div className="buttons">



			<button onClick={() => controller.handleInput("clr")} className="funcBtn clr">
				<Type>
					{"AC"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("bck")} className="funcBtn bck">
				<Backspace />
			</button>

			<button onClick={() => controller.handleInput("div")} className="opBtn div">
				<Type>
					{"÷"}
				</Type>
			</button>


			<button onClick={() => controller.handleInput("no7")} className="numBtn no7">
				<Type>
					{"7"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no8")} className="numBtn no8">
				<Type>
					{"8"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no9")} className="numBtn no9">
				<Type>
					{"9"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("mul")} className="opBtn mul">
				<Type>
					{"×"}
				</Type>
			</button>



			<button onClick={() => controller.handleInput("no4")} className="numBtn no4">
				<Type>
					{"4"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no5")} className="numBtn no5">
				<Type>
					{"5"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no6")} className="numBtn no6">
				<Type>
					{"6"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("sub")} className="opBtn sub">
				<Type>
					{"-"}
				</Type>
			</button>



			<button onClick={() => controller.handleInput("no1")} className="numBtn no1">
				<Type>
					{"1"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no2")} className="numBtn no2">
				<Type>
					{"2"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no3")} className="numBtn no3">
				<Type>
					{"3"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("add")} className="opBtn add">
				<Type>
					{"+"}
				</Type>
			</button>



			<button onClick={() => controller.handleInput("dot")} className="utilBtn dot">
				<Type>
					{"."}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("no0")} className="numBtn no0">
				<Type>
					{"0"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("par")} className="utilBtn par">
				<Type>
					{"()"}
				</Type>
			</button>

			<button onClick={() => controller.handleInput("eql")} className="funcBtn eql">
				<Type>
					{"="}
				</Type>
			</button>
		</div>
	</div>
}