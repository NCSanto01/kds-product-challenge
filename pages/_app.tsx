import { OrdersProvider } from "@/contexts/Orders.context"
import { RidersProvider } from "@/contexts/Riders.context"
import { UserProvider } from "@/contexts/User.context"
import "@/styles/globals.scss"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<OrdersProvider>
			<UserProvider>
				<RidersProvider>
					<Component {...pageProps} />
				</RidersProvider>
			</UserProvider>
		</OrdersProvider>
	)
}
