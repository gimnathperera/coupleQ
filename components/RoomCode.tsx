'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { formatRoomCode } from '@/lib/utils'
import { Button } from '@/lib/ui/button'

interface RoomCodeProps {
  code: string
  className?: string
  layout?: 'horizontal' | 'vertical' | 'compact'
  showLabel?: boolean
  label?: string
}

export function RoomCode({
  code,
  className = '',
  layout = 'horizontal',
  showLabel = true,
  label = 'Room Code:',
}: RoomCodeProps) {
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

  const getLayoutClasses = () => {
    switch (layout) {
      case 'vertical':
        return 'flex flex-col items-center space-y-2'
      case 'compact':
        return 'flex items-center space-x-1'
      case 'horizontal':
      default:
        return 'flex items-center space-x-2'
    }
  }

  const getCodeClasses = () => {
    switch (layout) {
      case 'compact':
        return 'font-mono text-sm font-bold bg-gray-100 px-2 py-1 rounded'
      case 'vertical':
        return 'font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded'
      case 'horizontal':
      default:
        return 'font-mono text-lg font-bold bg-gray-100 px-3 py-1 rounded'
    }
  }

  const getLabelClasses = () => {
    switch (layout) {
      case 'compact':
        return 'text-xs text-gray-600'
      case 'vertical':
        return 'text-sm text-gray-600'
      case 'horizontal':
      default:
        return 'text-sm text-gray-600'
    }
  }

  return (
    <motion.div
      className={`${getLayoutClasses()} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showLabel && <span className={getLabelClasses()}>{label}</span>}
      <code className={getCodeClasses()}>{formatRoomCode(code)}</code>
      <Button
        variant="copy"
        size="copy"
        onClick={handleCopy}
        className="flex items-center space-x-1"
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
