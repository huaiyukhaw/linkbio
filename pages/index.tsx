import Auth from '../components/Auth'
import Account from '../components/Account'
import ProfileList from '../components/ProfileList'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import { Profile } from '../lib/constants'

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    getPublicProfiles()
  }, [])

  async function getPublicProfiles() {
    try {
      const { data, error } = await supabase
        .from<Profile>("profiles")
        .select("id, username, avatar_url, links, updated_at")
        .order("updated_at", { ascending: false })

      if (error || !data) {
        throw error || new Error("No data")
      }
      console.log("Public profiles:", data)
      setProfiles(data)
    } catch (error: any) {
      console.log("error", error.message)
    }
  }

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <div className="min-h-screen flex">
          <div className="p-12 bg-indigo-500 grow-0">
            <ProfileList profiles={profiles} />
          </div>
          <div className="p-12  bg-red-500 flex-1">
            <Account key={session.user.id} session={session} />
          </div>
        </div>
      )}
    </div>
  )
}