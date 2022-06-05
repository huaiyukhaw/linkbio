import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { DEFAULT_AVATARS_BUCKET } from '../lib/constants'
import Image from 'next/image'

export type AvatarProps = {
    url: string | null,
    size: string,
    children?: JSX.Element,
    mode?: "profile" | "edit"
}

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
    xxl: "w-36 h-36",
};

const bottomOffsets = {
    xs: "-bottom-1",
    sm: "-bottom-1",
    md: "-bottom-1",
    lg: "-bottom-2",
    xl: "-bottom-3",
    xxl: "-bottom-4",
};

export default function AvatarComponent({ url, size, children, mode }: AvatarProps) {
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses]
    const bottomOffset = bottomOffsets[size as keyof typeof bottomOffsets]
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        if (url) {
            downloadImage(url)
        } else {
            setAvatarUrl(null)
        }
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

    if (mode === "profile") {
        return avatarUrl ? (
            <div className={`${sizeClass} relative`}>
                <Image className="rounded-full object-cover" src={avatarUrl} layout="fill" />
            </div>
        ) : (
            <></>
        )
    } else if (mode === "edit") {
        return avatarUrl ? (
            <div className={`${sizeClass} relative group`}>
                <Image className="rounded-full object-cover" src={avatarUrl} layout="fill" />
                {children}
            </div>
        ) :
            (
                <div className={`${sizeClass} rounded-full border-2 border-dashed border-gray-300 dark:border-gray-500 hover:border-gray-400 dark:hover:border-gray-400`}>
                    {children}
                </div>
            )
    } else {
        return avatarUrl ? (
            <div className={`${sizeClass} relative`}>
                <Image className="rounded-full object-cover" src={avatarUrl} layout="fill" />
            </div>
        ) : (
            <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-600 rounded-full ${sizeClass}`}>
                <svg className={`absolute ${bottomOffset} h-auto w-auto text-gray-400`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
        )
    }
}