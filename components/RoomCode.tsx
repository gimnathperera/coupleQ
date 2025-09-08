'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { formatRoomCode } from '@/lib/utils'
import { Button } from '@/lib/ui/button'

interface RoomCodeProps {
  code: string
  className?: string
}

export function RoomCode({ code, className = '' }: RoomCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy room code:', err)
    }
  }

  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm text-gray-600">Room Code:</span>
      <code className="font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded">
        {formatRoomCode(code)}
      </code>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="flex items-center space-x-1 p-1 rounded-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </Button>
    </motion.div>
  )
}
