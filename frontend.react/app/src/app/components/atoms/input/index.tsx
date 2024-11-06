import clsx from 'clsx'
import './_input.css'
import * as React from "react"

interface Props {
  type: 'text',
  name: string,
  id?: string,
  className?: string,
}

export function toId(name: string) {
  return `input-${name}`
}

export default function Input({id, type, name, className}: Props) {
  return (
    <input type={type} name={name} id={id || toId(name)} className={clsx('input', className)} />
  );
}