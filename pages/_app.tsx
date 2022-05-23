import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite, DarkThemeToggle } from 'flowbite-react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Flowbite>
      <div className="bg-white dark:bg-gray-800 h-screen">
        <div className="absolute right-0">
          <DarkThemeToggle />
        </div>
        <Component {...pageProps} />
      </div>
    </Flowbite>
  )
}

export default MyApp
