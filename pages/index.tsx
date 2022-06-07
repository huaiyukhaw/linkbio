import Auth from '../components/Auth'
import Dashboard from '../components/Dashboard'
import UserProfile from '../components/UserProfile'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import { Profile, EmptyProfile } from '../lib/constants'

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [profile, setProfile] = useState<Profile>(EmptyProfile)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    getUserProfile()
  }, [])

  async function getUserProfile() {
    try {
      const user = supabase.auth.user()

      const { data, error } = await supabase
        .from<Profile>("profiles")
        .select()
        .eq("id", user!.id)
        .single()

      if (error || !data) {
        throw error || new Error("No data")
      }
      setProfile(data)
    } catch (error: any) {
      console.log("error", error.message)
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white min-h-screen py-safe">
      {!session ? (
        <Auth />
      ) : (
        <div
          className="
            flex flex-col
            h-screen w-screen
            overflow-auto
            absolute
            py-safe
          ">
          {/* <header className="flex-shrink-0 w-full">
            <Navbar profile={profile} session={session} />
          </header> */}
          <div className="flex p-4 overflow-auto grow">
            <div className="hidden flex-none md:flex justify-end items-start pr-16 pt-8 w-5/12">
              <UserProfile userProfile={profile} />
            </div>
            <Dashboard key={session.user?.id} session={session} />
          </div>
        </div>
      )
      }
    </div>
  )
}