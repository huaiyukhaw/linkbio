import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite } from 'flowbite-react'
import Head from 'next/head'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Linkbio - The One Link for All Your Links</title>
        <meta name="description" content="The One Link for All Your Links" />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover' />
      </Head>
      <Script src="/theme.js" strategy="beforeInteractive" />
      {/* <Flowbite> */}
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
      {/* </Flowbite> */}
    </div>
  )
}

export default MyApp
