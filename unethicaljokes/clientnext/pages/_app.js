import Layout from '../components/Layout'
import '../styles/globals.css'
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <NextNProgress color="#29D" stopDelayMs={200} height={10} showOnShallow={true} />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
