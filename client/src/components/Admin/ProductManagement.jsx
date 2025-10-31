

import React from 'react'
import { Link } from 'react-router-dom';

const ProductManagement = () => {

    const products = [
        {
            _id: 12231232,
            name: "rrrzxyz",
            price: 1122,
            sku: "123432",
        },

    ];
    const handleDeleteProduct = (id)=>{
        if(window.confirm("Are You Sure You Want to Delete This Product?")){
            console.log("deleted product with id", id);
            
        }
    }




    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">
                Product Management
            </h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className='min-w-full text-left text-gray-500'>
                    <th className='bg-gray-100 text-xs uppercase text-gray-700'>
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Skew</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </th>
                </table>

                <tbody>
                    {
                        products.length > 0 ? (
                            products.map((product) => {
                                return <tr key={product._id} className='border-b hover:bg-gray-50 cursor-pointer'>
                                    <td className='p-4 font-medium text-gray-900 whitespace-nowrap'>{product.name}</td>
                                    <td className="p-4">₹{product.price}</td>
                                    <td className="p-4">{product.skew}</td>
                                    <td className="p-4"><Link to={`/admin/products/${product._id}/edit`} className='bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600'>
                                        EDIT
                                    </Link>
                                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={()=>handleDeleteProduct(product._id)}>DELETE</button></td>
                                </tr>
                            })
                        ) : (<tr> <td colSpan={4} className='p-4 text-center text-gray-500'>
                            No Product Found.</td></tr>)
                    }
                </tbody>
            </div>
        </div>
    )
}

export default ProductManagement