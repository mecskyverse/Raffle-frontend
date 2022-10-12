import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { Notificationprovider } from "web3uikit"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Notificationprovider>
                <Component {...pageProps} />
            </Notificationprovider>
        </MoralisProvider>
    )
}

export default MyApp
