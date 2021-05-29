import React, { useCallback, useContext, useState } from "react";

/**
 * The element context type is used to store HTML elements in a global
 * context by a key. They are stored in the `elements` property and can be
 * accessed with
 * 
 * `useElementContext().elements["your_key"]`
 * 
 * An element can be registered and / or deregistered with  
 * 
 * `useElementContext().register("your_key", element)`
 * `useElementContext().deregister("your_key")`
 * 
 * The purpose of this context is to enable callinghooks such as
 * `useComponentMenuState` from different places in the application,
 * which controls an open state (stored globally in the query or hash)
 * and an anchor element state which is stored globally in this context.
 * If the anchor element wouldn't be stored globally, the component calling
 * the `useComponentMenuState().handleOpen(e)` method would be controlling
 * a different anchor element state than the menu which would attempt to read
 * it with `useComponentMenuState().anchorEl`.
 */

/**
 * Type of context.
 */
type ElementContextType = {
	/**
	 * List of all elements by their keys.
	 */
	elements: Record<string, HTMLElement | undefined>;
	/**
	 * Function to register a new element into the context.
	 * 
	 * @param key     Key to use for registering to the elements list.
	 * @param element Element to register.
	 */
	register(key: string, element: HTMLElement): void;
	/**
	 * Function to deregister an element from the context.
	 * 
	 * @param key Key of element to deregister.
	 */
	deregister(key: string): void;
}

/**
 * Element context with default values
 */
const ElementContext = React.createContext<ElementContextType>(
	{
		elements: {},
		register() { throw new Error(`Using default ElementContext value`) },
		deregister() { throw new Error(`Using default ElementContext value`) }
	}
)

/**
 * Utility hook for accessing the element context.
 */
export function useElementContext() {
	return useContext(ElementContext)
}

/**
 * Global provider for the element context.
 */
export function ElementContextProvider(props: { children?: React.ReactNode }) {

	/**
	 * Register of elements
	 */
	const [elements, setElements] = useState<ElementContextType["elements"]>({})

	/**
	 * Register a new element to the register
	 */
	const register = useCallback((key: string, element: HTMLElement) => {
		setElements(prevState => ({ ...prevState, [key]: element }))
	}, [setElements])

	/**
	 * Deregister an element from the register
	 */
	const deregister = useCallback((key: string) => {
		setElements(prevState => {
			const { [key]: removableElement, ...nextState } = prevState
			return nextState
		})
	}, [setElements])

	return <ElementContext.Provider
		value={{ elements, register, deregister }}
		children={props.children}
	/>
}