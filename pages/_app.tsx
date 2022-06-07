import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite } from 'flowbite-react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Flowbite>
      <div className="bg-white dark:bg-gray-900 dark:text-white h-screen w-screen">
        <Component {...pageProps} />
      </div>
    </Flowbite>
  )
}

export default MyApp
