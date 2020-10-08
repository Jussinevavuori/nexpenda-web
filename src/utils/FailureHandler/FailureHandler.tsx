import { FailureHandlerMissingStrategyFailure } from "../Failures/FailureHandlerFailures";
import { Failure, Result } from "../Result/Result"
import { RecoveryStrategy, RecoveryStrategyFunctionCreator, RecoveryStrategyOptions } from "./RecoveryStrategy";

type ErrorMessageGeneratorOptions = {
	recoveryStrategyFailed?: boolean;
	recoveryStrategyMissing?: boolean;
	recoveryStrategySucceeded?: boolean;
}
type ErrorMessageGenerator = (failure: Failure<any>, options?: ErrorMessageGeneratorOptions) => string | undefined
type ErrorMessageOutput = (message: string | undefined) => void

export type FailureHandlerConstructorOptions<T> = {
	recoveryStrategy?: RecoveryStrategyFunctionCreator<T>;
	recoveryStrategyOptions?: RecoveryStrategyOptions;
	errorMessageGenerator?: ErrorMessageGenerator;
	errorMessageOutput?: ErrorMessageOutput;
}

const defaultErrorMessageGenerator: ErrorMessageGenerator = (msg) => undefined
const defaultErrorMessageOutput: ErrorMessageOutput = (msg) => {
	if (msg) { console.warn("[Using default FailureHandler output]", msg) }
}

export class FailureHandler<T = undefined> {

	private _recoveryStrategy?: RecoveryStrategy<T>;
	private _errorMessageGenerator: ErrorMessageGenerator;
	private _errorMessageOutput: (msg: string | undefined) => void;

	constructor(options?: FailureHandlerConstructorOptions<T>) {
		if (options?.recoveryStrategy) {
			this._recoveryStrategy = new RecoveryStrategy<T>(
				options.recoveryStrategy,
				options.recoveryStrategyOptions
			)
		}
		this._errorMessageGenerator = options?.errorMessageGenerator ?? defaultErrorMessageGenerator
		this._errorMessageOutput = options?.errorMessageOutput
			?? defaultErrorMessageOutput
	}

	/**
	 * Handle failure
	 */
	handleFailure<R>(failure: Failure<R>, context: T) {

		/**
		 * First we attempt recovery
		 */
		let recovery: Result<void> = new FailureHandlerMissingStrategyFailure<void>()
		if (this._recoveryStrategy) {
			recovery = this._recoveryStrategy.recover(failure, context)
			if (recovery.isSuccess() && this._recoveryStrategy.options.escapeAfterSuccesfulRecovery) {
				this._errorMessageOutput(undefined)
				return
			}
		}

		/**
		 * If no recovery was made, we get a message
		 */
		const errorMessage = this.getErrorMessage(failure, {
			recoveryStrategyFailed: recovery.isFailure() && recovery.reason === "failure-handler-strategy",
			recoveryStrategyMissing: recovery.isFailure() && recovery.reason === "failure-handler-missing-strategy",
			recoveryStrategySucceeded: recovery.isSuccess()
		})

		/**
		 * Then we output the error message
		 */
		this._errorMessageOutput(errorMessage)
	}

	/**
	 * Hooks an error message output
	 */
	useErrorMessageOuptut(output: ErrorMessageOutput) {
		this._errorMessageOutput = output
	}

	/**
	 * Unhooks an error message output
	 */
	clearErrorMessageOutput() {
		this._errorMessageOutput = defaultErrorMessageOutput
	}


	/**
	 * Creates a new recovery strategy to be used and saves it
	 */
	useRecoveryStrategy(recoveryStrategy: RecoveryStrategy<T>) {
		this._recoveryStrategy = recoveryStrategy
	}

	/**
	 * Removes a recovery strategy
	 */
	clearRecoveryStrategy() {
		this._recoveryStrategy = undefined;
	}

	/**
	 * Takes in any result, and if it is a failure, returns a string
	 * to be shown to the user as an error message.
	 */
	getErrorMessage<R>(failure: Failure<R>, options?: ErrorMessageGeneratorOptions): string {
		const errorMessage = this._errorMessageGenerator(failure, options)
		if (errorMessage) {
			return errorMessage
		} else {
			return failure.reason
		}
	}

}