import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { HiMoon, HiSun } from 'react-icons/hi'
import { Label, Select } from 'flowbite-react'

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState<boolean>(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (theme == "light") ?
        <button onClick={() => setTheme("dark")} className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            <>
                <span className="sr-only">
                    Toggle dark mode
                </span>
                <HiMoon className="h-5 w-5" />
            </>
        </button> :
        <button onClick={() => setTheme("light")} className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            <>
                <span className="sr-only">
                    Toggle light mode
                </span>
                <HiSun className="h-5 w-5" />
            </>
        </button>
}

export default ThemeSwitch