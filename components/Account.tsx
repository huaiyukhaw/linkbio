import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import UploadButton from '../components/UploadButton'
import Avatar from './Avatar'
import { AuthSession } from '@supabase/supabase-js'
import { DEFAULT_AVATARS_BUCKET, Profile, Link } from '../lib/constants'
import { Card, Label, TextInput, Button, Modal, Table } from 'flowbite-react'
import { HiPlusSm } from 'react-icons/hi'
import { MdMode } from 'react-icons/md'

export default function Account({ session }: { session: AuthSession }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [uploading, setUploading] = useState<boolean>(false)
    const [avatar, setAvatar] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [linkTitle, setLinkTitle] = useState<string>("")
    const [linkUrl, setLinkUrl] = useState<string>("")
    const [addingLink, setAddingLink] = useState<boolean>(false)
    const [links, setLinks] = useState<Link[]>([])

    useEffect(() => {
        getProfile()
    }, [session])

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) console.log("Error logging out:", error.message)
    }

    async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length == 0) {
                throw "You must select an image to upload."
            }

            const user = supabase.auth.user()
            const file = event.target.files[0]
            const fileExt = file.name.split(".").pop()
            const fileName = `${session?.user.id}${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from(DEFAULT_AVATARS_BUCKET)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            let { error: updateError } = await supabase.from("profiles").upsert({
                id: user!.id,
                avatar_url: filePath,
            })

            if (updateError) {
                throw updateError
            }

            setAvatar(null)
            setAvatar(filePath)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUploading(false)
        }
    }

    function setProfile(profile: Profile) {
        setAvatar(profile.avatar_url)
        setUsername(profile.username)
        console.log(profile)
        setLinks(profile.links)
    }

    async function getProfile() {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            let { data, error } = await supabase
                .from("profiles")
                .select(`username, avatar_url, links`)
                .eq("id", user!.id)
                .single()

            if (error) {
                throw error
            }

            setProfile(data)
        } catch (error) {
            console.log("error", error.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile() {
        try {
            setLoading(true)
            const user = supabase.auth.user()

            const updates = {
                id: user!.id,
                username,
                links: links,
                updated_at: new Date(),
            }

            let { error } = await supabase.from("profiles").upsert(updates, {
                returning: "minimal", // Don"t return the value after inserting
            })

            if (error) {
                throw error
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    function saveNewLink() {
        const newLink = { "title": linkTitle, "url": linkUrl }
        setLinks((oldArray) => [...oldArray, newLink])
        setLinkTitle("")
        setLinkUrl("")
        setAddingLink(false)
    }

    return (
        <Card className="max-w-md dark:text-white">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Account
            </h5>
            <div>
                <label htmlFor="avatar" className="sr-only">Avatar image</label>
                <div className="flex flex-col items-center text-center">
                    <Avatar url={avatar} size="lg" />
                    <UploadButton onUpload={uploadAvatar} loading={uploading} />
                </div>
            </div>

            <form className="flex flex-col gap-4">
                <div>
                    <Label
                        className="mb-2 block"
                        htmlFor="email"
                    >
                        Email
                    </Label>
                    <TextInput
                        id="email"
                        type="email"
                        value={session.user.email}
                        disabled={true}
                    />
                </div>
                <div>
                    <Label
                        className="mb-2 block"
                        htmlFor="username"
                    >
                        Name
                    </Label>
                    <TextInput
                        id="username"
                        type="text"
                        value={username || ""}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    {
                        links.map((link) => (
                            <div
                                className="cursor-pointer flex gap-2 items-center p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                key={link.url}
                            >
                                <div className="flex-1">
                                    <h5 className="break-all mb-1 font-bold tracking-tight text-gray-900 dark:text-white">{link.title}</h5>
                                    <p className="break-all font-normal text-gray-700 dark:text-gray-400">{link.url}</p>
                                </div>
                                <MdMode className="flex-none" />
                            </div>
                        ))
                    }
                </div>
                <>
                    <Button
                        onClick={() => { setAddingLink(true) }}
                        gradientDuoTone="purpleToBlue">
                        <HiPlusSm className="mr-2 h-5 w-5 -ml-1" />
                        Add Link
                    </Button>
                    <Modal
                        show={addingLink}
                        size="md"
                        popup={true}
                        onClose={() => { setAddingLink(false) }}
                    >
                        <Modal.Header />
                        <Modal.Body className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Add new link
                            </h3>
                            <div>
                                <Label
                                    className="mb-2 block"
                                    htmlFor="linkTitle"
                                >
                                    Title
                                </Label>
                                <TextInput
                                    id="linkTitle"
                                    className="dark:border-gray-500 dark:bg-gray-600"
                                    type="text"
                                    value={linkTitle || ""}
                                    onChange={(e) => setLinkTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label
                                    className="mb-2 block"
                                    htmlFor="linkUrl"
                                >
                                    URL
                                </Label>
                                <TextInput
                                    id="linkUrl"
                                    className="dark:border-gray-500 dark:bg-gray-600"
                                    type="text"
                                    value={linkUrl || ""}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={saveNewLink}>
                                Save
                            </Button>
                        </Modal.Body>
                    </Modal>
                </>
                <div className="flex flex-col gap-2">
                    <Button type="submit" onClick={() => updateProfile()} disabled={loading}>
                        {loading ? "Loading ..." : "Update"}
                    </Button>
                    {/* <Button color="alternative" onClick={() => signOut()}>
                        Sign Out
                    </Button> */}
                </div>
            </form>
        </Card>
    )
}