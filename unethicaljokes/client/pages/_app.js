import Nav from '../components/Nav'
import '../styles/globals.css'
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  return (
  <>
    <Head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </Head>
    <Nav />
    <ToastContainer />
    <Component {...pageProps} />
  </>
  )
}

export default MyApp
