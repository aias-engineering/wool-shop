import clsx from 'clsx'
import './_input.css'
import * as React from "react"

interface Props {
  type: 'text' | 'number' | 'hidden',
  name: string,
  required?: boolean,
  step?: string,
  value?: string,
  id?: string,
  className?: string,
}

export function toId(name: string) {
  return `input-${name}`
}

export default function Input({type, name, required, value, step, id, className}: Props) {
  return (
    <input type={type} 
          name={name} 
          required={required}
          step={step}
          value={value}
          id={id || toId(name)} 
          className={clsx('input', className)} />
  );
}