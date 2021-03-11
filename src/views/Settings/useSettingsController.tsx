import ReactGA from "react-ga";
import { useCallback } from "react"
import { useStoreState, useStoreActions } from "../../store"
import { useRedirect } from "../../hooks/utils/useRedirect"


export function useSettingsController() {
	const redirect = useRedirect()

	/**
	 * Auth and logout
	 */
	const user = useStoreState(_ => _.auth.user)
	const logout = useStoreActions(_ => _.auth.logout)
	const handleLogout = useCallback(async function () {
		const result = await logout()
		if (result.isSuccess()) {
			ReactGA.event({
				action: "Logout",
				category: "User",
			})
			redirect(_ => _.login)
		}
	}, [logout, redirect])

	const products = useStoreState(_ => _.stripe.products)
	const createCheckoutSession = useStoreActions(_ => _.stripe.createCheckoutSession)

	const handleSubscribe = () => {
		redirect(_ => _.subscribe)
	}

	const handleGoToCheckout = async () => {
		const price = products[0]?.data.prices[0]
		if (!price) return
		console.log("Price id: ", price.id)
		await new Promise((r) => setTimeout(r, 1000))
		createCheckoutSession(price.id)
	}

	return {
		user,
		handleLogout,
		handleSubscribe,
		handleGoToCheckout,
	}
}