import Image from 'next/image';
import Link from 'next/link'
import './_products.css'
import { Product } from '@/lib/azure/entities';

interface Props {
  items: Product[]
}

const Products = ({items}:Props) => (
  <>
    <div className="products">
      {items.length === 0 
        ? (
          <>
            <div className='products--middle-panel no-product'>
              nog geen producten
              <Link href="/admin/product/create">
                creëer de eerste
              </Link>
            </div>
          </>
          )
        : items.map((item, index) => (
          <div key={index}>
              <Image src={item.imageLinks?.length > 0 ? item.imageLinks[0] : ''}
                     width={480}
                     height={480}
                     alt={item.name} ></Image>
          </div>)
          )
      }
    </div>
  </>
)

export default Products;