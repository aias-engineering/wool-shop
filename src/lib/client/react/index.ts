import HasChildren from './has-children'
import MightHaveClassName from './might-have-className'

export interface HasId {
  id: string
}

export interface PromisesParams<T> {
  params: Promise<T>
}

export type { HasChildren, MightHaveClassName }
