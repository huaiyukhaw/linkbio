import { HOST, Profile } from '../lib/constants'
import Avatar from './Avatar'
import { HiExternalLink } from 'react-icons/hi'
import classNames from 'classnames';
import { DarkThemeToggle } from 'flowbite-react';
import Image from 'next/image';
import Logo from './Logo'

export default function ProfileComponent({ profile, mode }: { profile: Profile, mode: "card" | "page" }) {
    return (
        <div className="bg-white dark:bg-gray-900 dark:text-white py-safe">
            {
                mode === "page" &&
                <div className="absolute right-2 top-2 z-50">
                    <DarkThemeToggle />
                </div>
            }
            <div className={classNames("flex flex-col overflow-auto px-6 pt-12 pb-6 dark:text-white text-center", { "h-[650px] w-[315px] rounded-3xl border-[12px] border-gray-800 dark:border-gray-700 scrollbar": mode === "card" }, { "max-w-lg mx-auto min-h-screen": mode === "page" })} >
                <div className="flex flex-col items-center">
                    <Avatar url={profile.avatar_url} size="xl" mode="profile" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-4">
                    {profile.name}
                </h2>
                <h5 className="text-base font-normal text-gray-700 dark:text-gray-300 mt-3">
                    {profile.bio}
                </h5>
                <div className="mt-6 flex-1">
                    <div className="flex flex-col gap-2 text-left">
                        {
                            profile.links.map((link) => (
                                <a
                                    className="group cursor-pointer flex gap-2 items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                    key={link.id}
                                    href={link.url}
                                    target="_blank" rel="noreferrer"
                                >
                                    <div className="flex-1">
                                        <h5 className="break-all mb-1 font-bold text-gray-900 dark:text-white">{link.title}</h5>
                                        <p className="break-all line-clamp-1 font-normal text-gray-700 dark:text-gray-400">{link.url}</p>
                                    </div>
                                    <HiExternalLink className="flex-none opacity-60 group-hover:opacity-90" />
                                </a>
                            ))
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10 mb-6" >
                    <a href={HOST} target="_blank" rel="noreferrer">
                        <Logo className="fill-white w-16" />
                    </a>
                </div>
            </div>
        </div>
    )
}