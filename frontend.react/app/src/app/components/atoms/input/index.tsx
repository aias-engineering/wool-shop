import clsx from 'clsx'
import './_input.css'
import * as React from 'react'
import { MightHaveClassName } from '@/lib/client/react'

interface Props extends MightHaveClassName {
  type: 'text' | 'number' | 'hidden' | 'email' | 'password'
  name: string
  required?: boolean
  step?: string
  value?: string
  id?: string
  placeholder?: string
}

export function toId(name: string) {
  return `input-${name}`
}

export default function Input({
  type,
  name,
  required,
  value,
  step,
  id,
  className,
  placeholder,
}: Props) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      step={step}
      value={value}
      id={id || toId(name)}
      className={clsx('input', className)}
      placeholder={placeholder}
    />
  )
}
