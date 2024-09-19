import { Link } from 'react-router-dom'
import './Admin.css'

const Admin = () => (
    <div className='admin'>
        <div></div>
        <div>
            <h1>Welcome to the Admin Dashboard</h1>¨    
            <ul>
                <li>
                    <Link to={'/admin/product'}>Products</Link>
                </li>
            </ul>
        </div>
    </div>)

export default Admin