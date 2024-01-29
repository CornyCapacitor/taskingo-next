'use client'

import { useParams } from 'next/navigation'

const BoardPage = () => {
  const params = useParams()

  return (
    <div className="text-white">
      <h1>Board Page</h1>
      <p>User ID: {params.userId}</p>
      <p>ID: {params.id}</p>
    </div>
  )
}

export default BoardPage
