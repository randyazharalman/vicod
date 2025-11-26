"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Page = () => {
  const [value, setValue] = useState("")
  const trpc = useTRPC();
  const { data: messages} = useQuery(trpc.messages.getMany.queryOptions())
  const messageMutate = useMutation(trpc.messages.create.mutationOptions({
    onSuccess : () => {
      toast.success("Backgroun Job started!")
    }
  }))
  return (
    <div className='p-4 max-w-7xl  mx-auto'>
      <Input placeholder='input' value={value} onChange={(e)=> setValue(e.target.value)}/>
      <Button onClick={() => messageMutate.mutate({ value: value})}>
        Invoke Background Job
      </Button>

      <p>{JSON.stringify(messages, null, 2)}</p>
    </div>
  )
} 

export default Page