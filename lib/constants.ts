export const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
export const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const HOST = process.env.NEXT_PUBLIC_HOST
export const DOMAIN = process.env.NEXT_PUBLIC_HOST!.replace("http://", "").replace("https://", "")

export const DEFAULT_AVATARS_BUCKET = 'avatars'

export type Link = {
    title: string;
    url: string;
    id: string;
};

export type Profile = {
    id: string
    avatar_url: string
    username: string
    name: string
    bio: string
    links: Link[]
    updated_at: string,
    published: boolean,
    claimed: boolean
}

export const EmptyProfile = {
    "id": "",
    "avatar_url": "",
    "username": "",
    "name": "",
    "bio": "",
    "links": [],
    "updated_at": "",
    "published": false,
    "claimed": false
}