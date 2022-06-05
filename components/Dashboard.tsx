import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import UploadAvatarButton from './UploadAvatarButton'
import RemoveAvatarButton from './RemoveAvatarButton'
import Avatar from './Avatar'
import { AuthSession } from '@supabase/supabase-js'
import { DEFAULT_AVATARS_BUCKET, Profile, Link } from '../lib/constants'
import { Label, TextInput, Button, Modal, Spinner, Tabs } from 'flowbite-react'
import { MdOutlineEdit, MdAdd } from 'react-icons/md'
import { HiAtSymbol } from 'react-icons/hi'
import { v4 as uuidv4 } from 'uuid'
import { ReactSortable } from "react-sortablejs";

export default function Dashboard({ session }: { session: AuthSession }) {
    const [loading, setLoading] = useState<boolean>(true)
    const [pageLoaded, setPageLoaded] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)
    const [removing, setRemoving] = useState<boolean>(false)
    const [avatar, setAvatar] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)
    const [bio, setBio] = useState<string | null>(null)
    const [linkTitle, setLinkTitle] = useState<string>("")
    const [linkUrl, setLinkUrl] = useState<string>("")
    const [linkId, setLinkId] = useState<string>("")
    const [addingLink, setAddingLink] = useState<boolean>(false)
    const [editingLink, setEditingLink] = useState<boolean>(false)
    const [links, setLinks] = useState<Link[]>([])
    const [isEdit, setIsEdit] = useState<boolean>(false)

    useEffect(() => {
        getProfile()
    }, [session])

    useEffect(() => {
        if (pageLoaded) {
            updateProfile()
        }
    }, [links])

    async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length == 0) {
                throw "You must select an image to upload."
            }

            const user = supabase.auth.user()
            const file = event.target.files[0]
            const fileExt = file.name.split(".").pop()
            const fileName = `${session.user?.id}${Math.random()}.${fileExt}`
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

    async function removeAvatar() {
        try {
            setRemoving(true)
            if (avatar) {
                const user = supabase.auth.user()
                let { error: uploadError } = await supabase.storage
                    .from(DEFAULT_AVATARS_BUCKET)
                    .remove([avatar])

                if (uploadError) {
                    throw uploadError
                }

                let { error: updateError } = await supabase.from("profiles").upsert({
                    id: user!.id,
                    avatar_url: null,
                })

                if (updateError) {
                    throw updateError
                }
            }
            setAvatar(null)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setRemoving(false)
        }
    }

    function setProfile(profile: Profile) {
        setAvatar(profile.avatar_url)
        setUsername(profile.username)
        setName(profile.name)
        setBio(profile.bio)
        setLinks(profile.links)
    }

    async function getProfile() {
        try {
            setLoading(true)
            const user = supabase.auth.user()


            let { data, error } = await supabase
                .from("profiles")
                .select()
                .eq("id", user!.id)
                .single()

            if (error) {
                throw error
            }
            setProfile(data)
            setPageLoaded(true)

        } catch (error: any) {
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
                username: username,
                name: name,
                bio: bio,
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
            setIsEdit(false)
            setLoading(false)
        }
    }

    function checkUrlPrefix(s: string) {
        var httpPrefix = "http://";
        var httpsPrefix = "https://";
        if (s.substr(0, httpPrefix.length) !== httpPrefix && s.substr(0, httpsPrefix.length) !== httpsPrefix) {
            s = httpPrefix + s;
        }
        return s
    }

    function setLink(link: Link) {
        setLinkTitle(link.title)
        setLinkUrl(link.url)
        setLinkId(link.id)
    }

    function resetLink() {
        setLink({
            title: "",
            url: "",
            id: "",
        })
        setAddingLink(false)
        setEditingLink(false)
    }

    function editLink(link: Link) {
        setLink(link)
        setEditingLink(true)
    }

    function saveNewLink() {
        const newLink = { "title": linkTitle, "url": checkUrlPrefix(linkUrl), "id": uuidv4() }
        setLinks((oldArray) => {
            return [...oldArray, newLink]
        })
        resetLink()
    }

    function saveEditedLink() {
        const newLinks = links.map((link) => {
            if (link.id === linkId) {
                return {
                    title: linkTitle,
                    url: linkUrl,
                    id: linkId
                }
            }
            return link
        });
        setLinks(newLinks)
        resetLink()
    }

    function deleteLink() {
        const newLinks = links.filter((link) => {
            return link.id !== linkId;
        });
        setLinks(newLinks)
        resetLink()
    }

    function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        if (/\s/g.test(event.target.value)) {
            event.target.value = event.target.value.replace(/\s/g, "")
        }
        setUsername(event.target.value)
        if (!isEdit) {
            setIsEdit(true)
        }
    }

    return (
        <div className="dark:text-white w-full py-6 px-2 sm:px-6 overflow-auto scrollbar hover:scrollbar-visible">
            <Tabs.Group
                aria-label="Tabs for Dashboard"
                style="underline"
                className="px-0"
            >
                <Tabs.Item
                    title="Links"
                >
                    <div className="max-w-xl flex flex-col px-1 gap-4">
                        <Button
                            onClick={() => { setAddingLink(true) }}
                            gradientDuoTone="purpleToBlue"
                            className="!w-full"
                        >
                            <MdAdd className="mr-2 -ml-1" />
                            Add Link
                        </Button>
                        <ReactSortable
                            list={links}
                            setList={setLinks}
                            className="flex flex-col gap-2 select-none"
                            animation={150}
                            easing="cubic-bezier(1, 0, 0, 1)"
                            ghostClass="opacity-0"
                            handle=".drag-handle"
                        >
                            {
                                links.map((link) => (
                                    <div
                                        className="drag-handle cursor-move relative group flex items-center w-full bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                                        key={link.id}
                                    >
                                        <div className="p-4">
                                            <h5 className="break-all mb-1 font-bold text-gray-900 dark:text-white">{link.title}</h5>
                                            <p className="break-all font-normal text-gray-700 dark:text-gray-400">{link.url}</p>
                                        </div>
                                        <div
                                            className="invisible group-hover:visible cursor-pointer flex gap-1 items-center justify-center absolute right-0 top-2/4 transform -translate-y-1/2 mx-2 px-3 rounded-full bg-gray-50 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-900 p-1.5 border border-gray-200 dark:border-gray-700"
                                            onClick={() => editLink(link)}
                                        >
                                            <MdOutlineEdit className="mr-0.5 -ml-0.5" />
                                            <div className="text-sm font-semibold">Edit</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </ReactSortable>
                        <Modal
                            show={addingLink || editingLink}
                            size="md"
                            popup={true}
                            onClose={() => { resetLink() }}
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
                                        placeholder="Title"
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
                                        placeholder="URL"
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {
                                        editingLink ? (
                                            <>
                                                <Button onClick={saveEditedLink}>
                                                    Save Edit
                                                </Button>
                                                <Button onClick={deleteLink} color="red">
                                                    Delete
                                                </Button>
                                            </>
                                        ) : (
                                            <Button onClick={saveNewLink}>
                                                Save
                                            </Button>
                                        )
                                    }
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Design">
                    <div className="p-6 max-w-xl bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex">
                            <form className="flex-1 flex flex-col gap-4">
                                <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Profile
                                </h5>
                                <div className="flex">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={name || ""}
                                            placeholder="Name"
                                            onChange={(e) => { setName(e.target.value); setIsEdit(true) }}
                                        />
                                        <TextInput
                                            id="bio"
                                            type="text"
                                            value={bio || ""}
                                            placeholder="Bio"
                                            onChange={(e) => { setBio(e.target.value); setIsEdit(true) }}
                                        />
                                    </div>
                                    <div className="w-28 text-end">
                                        <label htmlFor="avatar" className="sr-only">Avatar image</label>
                                        <div className="flex flex-col items-end text-center relative">
                                            <Avatar url={avatar} size="xl" mode="edit">
                                                {
                                                    avatar ?
                                                        <RemoveAvatarButton onDelete={removeAvatar} loading={removing} /> :
                                                        <UploadAvatarButton onUpload={uploadAvatar} loading={uploading} size="xl" />
                                                }
                                            </Avatar>
                                        </div>
                                    </div>
                                </div>
                                {isEdit &&
                                    <Button type="submit" onClick={updateProfile} disabled={loading} className="!w-full" gradientDuoTone="purpleToPink">
                                        {loading ?
                                            <>
                                                <Spinner
                                                    className="mr-2 -mt-1"
                                                    size="sm"
                                                    light={true}
                                                />
                                                <div>Loading ...</div>
                                            </> : <div>Update</div>
                                        }
                                    </Button>
                                }
                            </form>
                        </div>
                    </div>
                </Tabs.Item>
                <Tabs.Item title="Settings">
                    <div className="p-6 max-w-xl bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex">
                            <form className="flex-1 flex flex-col gap-4">
                                <h5 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Username
                                </h5>
                                <div className="flex">
                                    <div className="flex flex-col gap-4 flex-1">
                                        <TextInput
                                            id="username"
                                            type="text"
                                            value={username || ""}
                                            placeholder="Username"
                                            onChange={(e) => handleUsernameChange(e)}
                                            icon={HiAtSymbol}
                                            helperText={<>You can change your username to another username that is not currently in use.</>
                                            }
                                        />
                                    </div>
                                </div>
                                {isEdit &&
                                    <Button type="submit" onClick={updateProfile} disabled={loading} className="!w-full" gradientDuoTone="purpleToPink">
                                        {loading ?
                                            <>
                                                <Spinner
                                                    className="mr-2 -mt-1"
                                                    size="sm"
                                                    light={true}
                                                />
                                                <div>Loading ...</div>
                                            </> : <div>Update</div>
                                        }
                                    </Button>
                                }
                            </form>
                        </div>
                    </div>
                </Tabs.Item>
                {/* <Tabs.Item title="Stats">
                    Coming soon
                </Tabs.Item>
                <Tabs.Item title="Settings">
                    Coming soon
                </Tabs.Item> */}
            </Tabs.Group>
        </div >
    )
}