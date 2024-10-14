'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon } from "lucide-react"
import Image from 'next/image'

export default function VerifyAccountComponent() {
    const [livePicture, setLivePicture] = useState<File | null>(null)
    const [idFront, setIdFront] = useState<File | null>(null)
    const [idBack, setIdBack] = useState<File | null>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
        if (event.target.files?.[0]) {
            setter(event.target.files[0])
        }
    }

    const handleVerify = () => {
        // Handle verification logic here
        console.log('Verifying account...')
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Verify Account</h2>

            <div className="space-y-6 font-medium">
                <div className='w-full flex items-start justify-center relative'>
                    {/* <Badge className="absolute bottom-2  z-10">Live Image</Badge> */}
                    <div className={`flex items-center justify-center w-32 h-32 rounded-xl ${livePicture ? "" : 'border-2 border-dashed border-gray-500'} cursor-pointer`}>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, setLivePicture)}
                            id="live-picture"
                        />
                        <label htmlFor="live-picture" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        {livePicture ?
                        <Image src={URL.createObjectURL(livePicture)} alt="live-picture" width={128} height={128} className="w-full h-full object-cover rounded-xl" /> :
                        <>
                            <span className="mt-2 text-sm text-text-700 text-center">Add Your Live Picture</span>
                            <PlusIcon className="w-8 h-8 text-primary" />
                        </>   
                        }
                        </label>
                    </div>
                </div>

                <Card className="p-4 border-dashed border-primary-400 relative">
                    <Badge className="absolute -top-2  z-10">ID Card Front</Badge>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setIdFront)}
                        id="id-front"
                    />
                    <label htmlFor="id-front" className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                    {idFront ? 
                        <div className="w-[280px] h-[180px] rounded-lg overflow-hidden">
                            <Image src={URL.createObjectURL(idFront)} alt="id-front" width={640} height={480} className="w-full h-full object-cover" />
                        </div> :
                        <div className="flex flex-col items-center">
                            <Image src="/assets/icons/image-placeholder.svg" className="w-12 h-12 text-text-500 mb-2" alt='id-front-placeholder' width={48} height={48} />
                            <span className="text-text-600">Upload National ID Front</span>
                        </div>
                    }
                    </label>
                </Card>

                <Card className="p-4 border-dashed border-primary-400 relative">
                    <Badge className="absolute -top-2 z-10">ID Card Back</Badge>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setIdBack)}
                        id="id-back"
                    />
                    <label htmlFor="id-back" className="flex flex-col items-center justify-center gap-4 cursor-pointer">
                    {idBack ? 
                        <div className="w-[280px] h-[180px] rounded-lg overflow-hidden">
                            <Image src={URL.createObjectURL(idBack)} alt="id-back" width={640} height={480} className="w-full h-full object-cover" />
                        </div> :
                        <div className="flex flex-col items-center">
                            <Image src="/assets/icons/image-placeholder.svg" className="w-12 h-12 text-text-500 mb-2" alt='id-back-placeholder' width={48} height={48} />
                            <span className="text-text-600">Upload National ID Back</span>
                        </div>
                    }
                    </label>
                </Card>
            </div>

            <Button className="w-full" onClick={handleVerify}>Verify Now</Button>
        </div>
    )
}