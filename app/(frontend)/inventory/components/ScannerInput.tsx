'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface ScannerInputProps {
  onScan: (barcode: string) => void
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function ScannerInput({
  onScan,
  placeholder = 'Scan barcode or type manually...',
  disabled = false,
  autoFocus = true,
  className = '',
}: ScannerInputProps) {
  const [value, setValue] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastKeyTime = useRef<number>(0)

  // Auto-focus on mount and when enabled
  useEffect(() => {
    if (autoFocus && !disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus, disabled])

  // Handle rapid input (scanner detection)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now()
    const timeDiff = now - lastKeyTime.current
    lastKeyTime.current = now

    // If keys are coming in very fast (< 50ms), it's likely a scanner
    if (timeDiff < 50 && !isScanning) {
      setIsScanning(true)
    }

    // Handle Enter key to submit
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      onScan(value.trim())
      setValue('')
      setIsScanning(false)
    }
  }, [value, onScan, isScanning])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleBlur = () => {
    // Re-focus after a short delay to keep scanner input active
    if (autoFocus && !disabled) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className={`w-5 h-5 ${isScanning ? 'text-green-500 animate-pulse' : 'text-slate-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`
          w-full pl-12 pr-4 py-4 text-lg
          bg-white dark:bg-slate-800
          border-2 border-slate-200 dark:border-slate-700
          rounded-lg
          text-slate-900 dark:text-white
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:outline-none focus:border-navy dark:focus:border-navy-light
          focus:ring-2 focus:ring-navy/20 dark:focus:ring-navy-light/20
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isScanning ? 'border-green-500 ring-2 ring-green-500/20' : ''}
        `}
      />
      {isScanning && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span className="text-xs font-medium text-green-500 uppercase tracking-wider">
            Scanning...
          </span>
        </div>
      )}
    </div>
  )
}
