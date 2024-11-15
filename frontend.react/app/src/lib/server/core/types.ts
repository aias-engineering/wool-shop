// overall types
export class Unit {
  static done = new Unit()
}

// product types
export interface Product {
  id: string
  name: string
  descripiton: string | null
  price: string
  image: string
}
