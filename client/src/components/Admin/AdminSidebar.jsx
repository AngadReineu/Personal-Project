

import React, { useState } from 'react'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/slice/authSlice';
import { clearCart } from '../../redux/slice/cartSlice';

const AdminSidebar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout =()=>{
    dispatch(logout());
    dispatch(clearCart());
    navigate("/")//for now
  }


  return (
    <div className='p-6'>
      <div className="mb-6">
        <Link to="/admin" className='text-2xl font-medium'>XYZ</Link>
      </div>
      <h2 className='text-xl font-medium mb-6 text-center'>
        <Link to='/admin'>Admin Dashboard </Link>
      </h2>

      <nav className='flex flex-col space-y-2'>
        <NavLink to="/admin/users"
         className={({isActive})=> isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center selection space-x-2": "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
        <FaUser />
        <span>Users</span>
        </NavLink>


        <NavLink to="/admin/products" className={({isActive})=> isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center selection space-x-2": "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 tracking-tighter"}>
        <FaBoxOpen />
        <span>Products </span>
        </NavLink>
        <NavLink to="/admin/products-management" className={({isActive})=> isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center selection space-x-2": "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2 tracking-tighter"}>
        <FaBoxOpen />
        <span>Products Mangement</span>
        </NavLink>


        <NavLink to="/admin/orders" className={({isActive})=> isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center selection space-x-2": "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
        <FaClipboardList />
        <span>Orders</span>
        </NavLink>


        <NavLink to="/" className={({isActive})=> isActive? "bg-gray-700 text-white py-3 px-4 rounded flex items-center selection space-x-2": "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
        <FaStore />
        <span>Shop</span>
        </NavLink>
        <div className='mt-6 '>
          <button onClick={handleLogout} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer'>
             <FaSignOutAlt/>
             <span>LogOut</span>
             </button>
        </div>
      </nav>
    </div>
  )
}

export default AdminSidebar