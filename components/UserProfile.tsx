import ProfileCard from './Profile'
import { Profile } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function ProfileList({ userProfile }: { userProfile: Profile }) {
    const [profile, setProfile] = useState<Profile>(userProfile)
    // const lastUpdated = profile.updated_at ? new Date(profile.updated_at) : null

    useEffect(() => {
        const user = supabase.auth.user()

        const subscription = supabase
            .from(`profiles:id=eq.${user!.id}`)
            .on("UPDATE", (payload) => {
                setProfile(payload.new)
            })
            .subscribe()

        return () => {
            supabase.removeSubscription(subscription)
        }
    }, [])

    useEffect(() => {
        setProfile(userProfile)
    }, [userProfile])

    return (
        <>
            <ProfileCard profile={profile} mode="card" />
        </>
    )
}