"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Page = () => {
  const [value, setValue] = useState("")
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess : () => {
      toast.success("Backgroun Job started!")
    }
  }))
  return (
    <div className='p-4 max-w-7xl  mx-auto'>
      <Input placeholder='input' value={value} onChange={(e)=> setValue(e.target.value)}/>
      <Button onClick={() => invoke.mutate({ value: "tstddd"})}>
        Invoke Background Job
      </Button>
    </div>
  )
} 

export default Page