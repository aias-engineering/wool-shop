'use client'

import { MightHaveClassName } from '@/lib/client/react'
import clsx from 'clsx'
import { useState } from 'react'
import { toId } from '../input'
import { Euro } from 'lucide-react'

interface Props extends MightHaveClassName {
  defaultValue?: string | number
  disabled?: boolean
  id?: string
  name: string
}

const parseDefaultValue = (
  defaultValue: string | number | undefined,
): [number, number, number] => {
  if (!defaultValue) return [0, 0, 0.0]
  const asFloat = (input: string | number) =>
    typeof input === 'string' ? Number.parseFloat(input) : input
  const fullDefault = asFloat(defaultValue)
  const defaultRight = fullDefault % 1
  const defaultLeft = fullDefault - defaultRight
  return [defaultLeft, defaultRight, fullDefault]
}

export default function CurrencyInput({
  className,
  defaultValue,
  disabled,
  id,
  name,
}: Props) {
  const [defaultLeft, defaultRight, defaultFull] =
    parseDefaultValue(defaultValue)

  const [left, setLeft] = useState<string>(defaultLeft.toFixed(0))
  const [right, setRight] = useState<string>(defaultRight.toFixed(0))
  const [full, setFull] = useState<number>(defaultFull)

  const handleUpdate = ([leftUpdateString, rightUpdateString]: [
    string,
    string,
  ]): void => {
    setLeft(leftUpdateString)
    setRight(rightUpdateString)

    const leftUpdate = Number.parseInt(leftUpdateString) || 0
    const rightUpdate = Number.parseInt(rightUpdateString) || 0

    const unroundedFull = leftUpdate + rightUpdate / 100
    const full = Math.round((unroundedFull + Number.EPSILON) * 100) / 100
    setFull(full)
  }

  return (
    <div className={clsx('flex flex-row gap-1 justify-end', className)}>
      <input
        type="number"
        name="left"
        value={left}
        className={clsx(
          'flex h-9 rounded-md border border-input bg-transparent px-3 py-1',
          'text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1',
          'focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'w-full',
        )}
        disabled={disabled}
        min={0}
        max={10000}
        onChange={(e) => handleUpdate([e.target.value, right])}
      />
      <div className="flex items-end py-1">.</div>
      <input
        type="number"
        name="right"
        value={right}
        className={clsx(
          'flex h-9 rounded-md border border-input bg-transparent px-3 py-1',
          'text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1',
          'focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'w-20',
        )}
        disabled={disabled}
        min={0}
        max={99}
        onChange={(e) => handleUpdate([left, e.target.value])}
      />
      <div className="flex items-end py-1">
        <Euro />
      </div>
      <input id={id || toId(name)} type="hidden" name={name} value={full} />
    </div>
  )
}
