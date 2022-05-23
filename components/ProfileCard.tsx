import { Profile } from '../lib/constants'
import Avatar from './Avatar'
import { Card } from 'flowbite-react'
import { HiExternalLink } from 'react-icons/hi'

export default function ProfileCard({ profile }: { profile: Profile }) {
    const lastUpdated = profile.updated_at ? new Date(profile.updated_at) : null
    return (
        <Card className="max-w-sm dark:text-white text-center">
            <div className="flex flex-col items-center">
                <Avatar url={profile.avatar_url} size="lg" />
            </div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {profile.username}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                Last updated{' '}
                {lastUpdated
                    ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`
                    : 'Never'}
            </p>
            <div className="flex flex-col gap-2 text-left">
                {
                    profile.links.map((link) => (
                        <a
                            className="cursor-pointer flex gap-2 items-center p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            key={link.url}
                            href={link.url}
                            target="_blank"
                        >
                            <div className="flex-1">
                                <h5 className="break-all mb-1 font-bold tracking-tight text-gray-900 dark:text-white">{link.title}</h5>
                                <p className="break-all font-normal text-gray-700 dark:text-gray-400">{link.url}</p>
                            </div>
                            <HiExternalLink className="flex-none" />
                        </a>
                    ))
                }
            </div>
        </Card>
    )
}