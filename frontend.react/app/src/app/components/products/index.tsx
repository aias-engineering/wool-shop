import './_products.css'
import Link from 'next/link'
import { Product } from '@/lib/azure/entities'
import ProductsItem from './item'

interface Props {
  items: Product[]
}

const Products = ({ items }: Props) => (
  <>
    <div className="products">
      {items.length === 0 ? (
        <>
          <div className="products--middle-panel no-product">
            nog geen producten
            <Link href="/admin/product/create">creëer de eerste</Link>
          </div>
        </>
      ) : (
        items.map((item, index) => <ProductsItem key={index} product={item} />)
      )}
    </div>
  </>
)

export default Products
