import { FailureHandlerStrategyFailure } from "../Failures/FailureHandlerFailures"
import { Failure, Success } from "../Result/Result"

export type RecoveryStrategyOptions = {
	escapeAfterSuccesfulRecovery?: boolean
}

export type RecoveryStrategyFunctionCreator<T> = (failure: Failure<any>, context: T) => boolean
export type RecoveryStrategyFunction<T> = (failure: Failure<any>, context: T) => Success<void> | FailureHandlerStrategyFailure<void>

export class RecoveryStrategy<T = undefined> {

	private _recover: RecoveryStrategyFunction<T>

	private _options: RecoveryStrategyOptions

	constructor(recover: RecoveryStrategyFunctionCreator<T>, options?: RecoveryStrategyOptions) {
		this._recover = (failure, context) => {
			const recovered = recover(failure, context)
			if (recovered) {
				return Success.Empty()
			} else {
				return new FailureHandlerStrategyFailure<void>()
			}
		}
		this._options = options ?? {}
	}

	get options() {
		return this._options
	}

	recover<R>(failure: Failure<R>, context: T) {
		return this._recover(failure, context)
	}
}