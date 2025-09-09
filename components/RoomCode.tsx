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
        return 'font-mono text-xs font-bold bg-secondary px-2 py-1 rounded-md border border-border'
      case 'vertical':
        return 'font-mono text-xs font-bold bg-secondary px-2 py-1 rounded-md border border-border'
      case 'horizontal':
      default:
        return 'font-mono text-xs font-bold bg-secondary px-2 py-1 rounded-md border border-border'
    }
  }

  const getLabelClasses = () => {
    switch (layout) {
      case 'compact':
        return 'text-xs text-muted-foreground'
      case 'vertical':
        return 'text-sm text-muted-foreground'
      case 'horizontal':
      default:
        return 'text-sm text-muted-foreground'
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
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-sm text-xs shadow-none border-none"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-success" />
            <span className="text-success">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </>
        )}
      </Button>
    </motion.div>
  )
}
