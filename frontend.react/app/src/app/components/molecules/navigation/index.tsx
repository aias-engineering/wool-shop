import HasChildren from '@/lib/client/react/has-children';
import './_navigation.css'
import Link from 'next/link';

export default function Navigation({children}: HasChildren) {
  return (
    <div className='navigation'>
      {children}
    </div>
  )
}

interface NavigationLinkProps extends HasChildren {
  href: string,
}

export function NavigationLink({href, children}: NavigationLinkProps) {
  return (
    <Link className='navigation__link' href={href}>
      {children}
    </Link>
  )
}