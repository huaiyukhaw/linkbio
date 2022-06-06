import { Navbar, Dropdown, Button } from "flowbite-react"
import { Profile, HOST, DOMAIN } from '../lib/constants'
import { MdLink } from "react-icons/md"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from "react";
import { supabase } from '../lib/supabaseClient'
import { AuthSession } from '@supabase/supabase-js'
import Avatar from "./Avatar"

export default function NavbarComponent({ profile, session }: { profile: Profile, session: AuthSession }) {
    const [copied, setCopied] = useState<boolean>(false)

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) console.log("Error logging out:", error.message)
    }

    function copyLink() {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <>
            <Navbar>
                <Navbar.Brand href="/">
                    {/* <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="mr-3 h-6 sm:h-9"
                        alt="Flowbite Logo"
                    /> */}
                    <MdLink className="mr-2 h-6 sm:h-9" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Linkbio
                    </span>
                </Navbar.Brand>
                <div className="flex gap-x-2 items-center">
                    {
                        profile.username &&
                        <>
                            <a className="dark:text-gray-300 dark:hover:text-white hover:underline truncate w-28 md:w-auto" href={`${HOST}/${profile.username}`} target="_blank">{DOMAIN}/{profile.username}</a>
                            <CopyToClipboard text={`${HOST}/${profile.username}`}
                                onCopy={copyLink}>
                                <Button color="alternative" >
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </CopyToClipboard>
                        </>
                    }
                    <Dropdown
                        arrowIcon={false}
                        inline={true}
                        placement="bottom"
                        label={<Avatar url={profile.avatar_url} size="md" />}
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">
                                {profile.username}
                            </span>
                            <span className="block truncate text-sm font-medium">
                                {session.user?.email}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={() => signOut()}>
                            Sign Out
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </Navbar>
        </>
    )
}