import { supabase } from '../lib/supabaseClient'
import { Profile } from '../lib/constants'
import ProfilePage from '../components/Profile'

export async function getServerSidePaths() {
    try {
        const { data, error } = await supabase
            .from<Profile>("profiles")
            .select()
            .order("updated_at", { ascending: false })

        if (error || !data) {
            throw error || new Error("No data")
        }

        const paths = data?.map((profile) => ({
            params: { username: profile.username },
        }))
        return { paths, fallback: false }

    } catch (error: any) {
        console.log("error", error.message)
    }
}

export async function getServerSideProps({ params }: { params: Profile }) {
    try {
        const { data, error } = await supabase
            .from<Profile>("profiles")
            .select()
            .eq("username", params.username)
            .single()

        if (error || !data) {
            throw error || new Error("No data")
        }
        return { props: { data } }

    } catch (error: any) {
        console.log("error", error.message)
    }
}

export default function User({ data: profile }: { data: Profile }) {
    return (
        <ProfilePage profile={profile} mode="page" />
    )
}