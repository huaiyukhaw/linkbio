import { Button } from 'flowbite-react'

export type RemoveAvatarButtonProps = {
    onDelete: () => void
    loading: boolean
}

export default function DeleteAvatarButton({ onDelete, loading }: RemoveAvatarButtonProps) {
    return (
        <Button size="xs" color="dark" onClick={onDelete} className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {loading ? "Removing .." : "Remove" }
        </Button>
    )
}