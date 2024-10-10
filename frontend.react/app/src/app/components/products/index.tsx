import Link from 'next/link'
import './_products.css'

interface Props {
  items: []
}

const Products = ({items}:Props) => (
  <>
    <div className="products">
      {items.length === 0 && (
        <>
          <div className='products--middle-panel no-product'>
            nog geen producten
            <Link href="/admin/product/create">
              creëer de eerste
            </Link>
          </div>
        </>
        )
      }
    </div>
  </>
)

export default Products;