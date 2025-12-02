"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter()
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Backgroun Job started!");
        router.push(`/projects/${data.id}`)
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  return (
    <div className="p-4 max-w-7xl  mx-auto">
      <Input
        placeholder="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
      >
        Invoke Background Job
      </Button>

      <p>{JSON.stringify(messages, null, 2)}</p>
    </div>
  );
};

export default Page;
