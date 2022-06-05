import { ChangeEventHandler } from 'react'
import { Label, FileInput, Spinner } from 'flowbite-react'
import { MdCameraAlt } from 'react-icons/md'

export type UploadAvatarButtonProps = {
    onUpload: ChangeEventHandler<HTMLInputElement>
    loading: boolean
    size: string
}

const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
    xxl: "w-36 h-36",
};

const iconSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
    xxl: "w-8 h-8",
};

export default function UploadAvatarButton({ onUpload, loading, size }: UploadAvatarButtonProps) {
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses]
    const iconSizeClass = iconSizeClasses[size as keyof typeof sizeClasses]

    return (
        <>
            <Label
                className={`group cursor-pointer ${sizeClass} flex items-center justify-center text-xs`}
                htmlFor="uploadImage"
            >
                {loading ? "Loading ..." : <MdCameraAlt className={`${iconSizeClass} -ml-1 -mt-1 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300`} />}
            </Label>
            <FileInput
                id="uploadImage"
                accept="image/*"
                onChange={onUpload}
                disabled={loading}
                className="hidden absolute"
            />
        </>
    )
}