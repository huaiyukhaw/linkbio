import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card, Spinner, TextInput, Button } from 'flowbite-react'
import { setServers } from 'dns'

export default function Auth({ }) {
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error, user } = await supabase.auth.signIn({ email })
      if (error) throw error
      console.log('user', user)
      setIsSent(true)
      alert('Check your email for the login link!')
    } catch (error: any) {
      console.log('Error thrown:', error.message)
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mx-4 py-safe">
      <div className="max-w-lg mx-auto mt-36 sm:mt-48 lg:mt-64">
        <h1 className="text-5xl sm:text-6xl font-bold text-center">The One Link for All Your Links</h1>
      </div>
      <div className="mt-8">
        <Card className="max-w-lg">
          {isSent ?
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Check your email for the login link!
            </h5>
            :
            <>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in via magic link with your email
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
                  handleLogin(email)
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