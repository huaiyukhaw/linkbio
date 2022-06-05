import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Flowbite, DarkThemeToggle } from 'flowbite-react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Flowbite>
      <div className="absolute right-4 top-3 z-50">
        <DarkThemeToggle />
      </div>
      <Component {...pageProps} />
    </Flowbite>
  )
}

export default MyApp
