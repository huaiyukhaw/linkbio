import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card, Spinner, TextInput, Button } from 'flowbite-react'
import { FcGoogle } from 'react-icons/fc'
import { DarkThemeToggle } from 'flowbite-react'

export default function Auth({ }) {
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSignIn = async (email: string) => {
    try {
      setLoading(true)
      const { error, user } = await supabase.auth.signIn({ email })
      if (error) throw error
      setIsSent(true)
      alert('Check your email for the login link!')
    } catch (error: any) {
      console.log('Error thrown:', error.message)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true)
      const { error, user } = await supabase.auth.signIn({
        provider: 'google',
      })
      if (error) throw error
    } catch (error: any) {
      console.log('Error thrown:', error.message)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mx-4 py-safe">
      <div className="absolute right-2 top-2 z-50">
        <DarkThemeToggle />
      </div>
      <div className="max-w-lg mx-auto mt-36 sm:mt-48 lg:mt-64">
        <h1 className="text-5xl sm:text-6xl font-bold text-center">The One Link for All Your Links</h1>
      </div>
      <div className="mt-8">
        <Card className="max-w-md text-center">
          <button type="button" onClick={handleSignInWithGoogle} className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
            <FcGoogle className="w-4 h-4 mr-2 -ml-1" />
            Sign in with Google
          </button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-2 text-gray-400 text-xs font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          {isSent ?
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Check your email for the login link!
            </h5>
            :
            <>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in via magic link
              </h5>
              <form className="flex flex-col sm:flex-row gap-4">
                <div className="grow min-w-sm">
                  <TextInput
                    id="magicEmail"
                    type="email"
                    value={email}
                    placeholder="Your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" onClick={(e) => {
                  e.preventDefault()
                  handleSignIn(email)
                }} disabled={loading}
                  className="!w-full sm:!w-auto"
                >
                  {loading ? <>
                    <Spinner
                      className="mr-2 -mt-1"
                      size="sm"
                      light={true}
                    />
                    <div>Loading ...</div>
                  </> : <div>Send Magic Link</div>}

                </Button>
              </form>
            </>}
        </Card>
      </div>
    </div>
  )
}