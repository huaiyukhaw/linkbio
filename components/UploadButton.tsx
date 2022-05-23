import { ChangeEventHandler } from 'react'
import { Label, FileInput } from 'flowbite-react'

export type UploadButtonProps = {
    onUpload: ChangeEventHandler<HTMLInputElement>
    loading: boolean
}

export default function UploadButton(props: UploadButtonProps) {
    return (
        <div>
            <Label
                className="mb-2 block cursor-pointer hover:underline"
                htmlFor="uploadImage"
            >
                {props.loading ? 'Uploading ...' : 'Upload'}
            </Label>
            <FileInput
                id="uploadImage"
                accept="image/*"
                onChange={props.onUpload}
                disabled={props.loading}
                className="hidden absolute"
            />
        </div>
    )
}