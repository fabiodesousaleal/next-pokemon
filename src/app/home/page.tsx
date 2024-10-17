"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Carregando...</div>
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Bem-vindo, {session?.user?.name}!</h1>
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>ID:</strong> {session?.id}</p>
        </div>
      </div>
    )
  }

  return null
}
