import { match } from "ts-pattern";
import { useAppSelector } from "../../../lib/hooks.ts";

export default function Products() {
        const state = useAppSelector(state => state.products)

    return (
        <div>{match(state.fetchState)
            .with({status: 'fetching'}, () => 'Fetching...')
            .with({status: 'fetched'}, ({products}) => (<div>{products.length} Products</div>))
            .otherwise(() => '')}
    </div>)
}