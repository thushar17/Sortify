'use client'
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import axios from "axios";
type Props = {
  slug: string;
};

export default function VerifyPasswordForm({
  slug,
}: Props){
  const [password, setPassword] = useState("")
   const router = useRouter()

   async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    try {
      await api.post('/api/verify-password',{
        slug,
        password
      })

      toast.success("password Verified")
     window.location.href = `/${slug}`;
    } catch (error) {
       if (axios.isAxiosError(error)){
         toast.error(
      error.response?.data?.error ||
      "Verification failed"
    );
    return;
       }
      toast.error(
        "Verification failed"
      )
    }
   }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button type="submit">
        Continue
      </button>
    </form>
  );
}
