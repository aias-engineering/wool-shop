import clsx from 'clsx'
import './_input.css'
import * as React from 'react'
import { MightHaveClassName } from '@/lib/client/react'

interface Props extends MightHaveClassName {
  type: 'text' | 'number' | 'hidden' | 'email' | 'password'
  defaultValue?: string
  disabled?: boolean
  name: string
  required?: boolean
  step?: string
  value?: string
  id?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  placeholder?: string
}

export function toId(name: string) {
  return `input-${name}`
}

export default function Input({
  type,
  defaultValue,
  disabled,
  name,
  required,
  value,
  step,
  id,
  className,
  onChange,
  placeholder,
}: Props) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      required={required}
      step={step}
      value={value}
      id={id || toId(name)}
      className={clsx('input', className)}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}
