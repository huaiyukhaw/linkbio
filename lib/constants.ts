export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const DEFAULT_AVATARS_BUCKET = 'avatars'

export type Link = {
    title: string;
    url: string;
};

export type Profile = {
    id: string
    avatar_url: string
    username: string
    links: Link[]
    updated_at: string
}