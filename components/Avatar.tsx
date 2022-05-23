import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'

export type AvatarProps = {
    url: string | null,
    size: string
}

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
    xl: "w-36 h-36",
};

const bottomOffsets = {
    xs: "-bottom-1",
    sm: "-bottom-1",
    md: "-bottom-1",
    lg: "-bottom-2",
    xl: "-bottom-4",
};

export default function AvatarComponent({ url, size }: AvatarProps) {
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses]
    const bottomOffset = bottomOffsets[size as keyof typeof bottomOffsets]
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            const { data, error }: any = await supabase.storage.from(DEFAULT_AVATARS_BUCKET).download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            setAvatarUrl(url)
        } catch (error: any) {
            console.log('Error downloading image: ', error.message)
        }
    }

    return avatarUrl ? (
        <img className={`rounded-full object-cover  ${sizeClass}`} src={avatarUrl} alt="avatar" />
    ) :
        (<div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-600 rounded-full ${sizeClass}`}>
            <svg className={`absolute ${bottomOffset} h-auto w-auto text-gray-400`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
        </div>)
}