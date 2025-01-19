'use client'

import { MightHaveClassName } from '@/lib/client/react'
import HasChildren from '@/lib/client/react/has-children'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation({
  children,
  className,
}: HasChildren & MightHaveClassName) {
  return <nav className={clsx('flex', className)}>{children}</nav>
}

interface NavigationLinkProps extends HasChildren, MightHaveClassName {
  href: string
}

export function NavigationLink({
  href,
  children,
  className,
}: NavigationLinkProps) {
  const currentPath = usePathname()
  const isCurrent = href === currentPath
  return (
    <Link
      className={clsx(
        'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 justify-start',
        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground',
        isCurrent
          ? 'bg-gray-200 hover:bg-gray-200'
          : 'hover:bg-transparent hover:underline',
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
