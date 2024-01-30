'use client'

import { authAtom } from '@/state/atoms'
import { useAtom } from 'jotai'
import { useParams } from 'next/navigation'

const BoardPage = () => {
  const params = useParams()
  const [user] = useAtom(authAtom)

  return (
    <div className="text-white">
      <h1>Board Page</h1>
      <p>User ID: {user?.id}</p>
      <p>ID: {params.id}</p>
    </div>
  )
}

export default BoardPage
