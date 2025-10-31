

import React, { useState } from 'react'

const UserManagement = () => {

    const users = [
        {
            _id:123,
            name: "xyz",
            email: "xyz@gmail.com",
            role: 'admin'
        },

    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer", //default role
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        setFormData({ // to reset the form after 
            name: "",
            email: "",
            password: "",
            role: "customer",
        })
    }

    const handleDeleteUser=(userId)=>{
        if(window.confirm("Are you Sure you want to Delete this User?")){
            console.log("Deleting user with ID", userId);
            
        }
    }

    const handleRoleChange = (userId, newRole)=>{
        console.log({id:userId, role:newRole});
        
    };




    return (
        <div className='max-w-7xl mx-auto p-6'>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            {/* user form */}
            <div className="p-6 rounded-lg mb-6">
                <h3 className='text-lg font-bold mb-4'>
                    Add New User
                </h3>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full border p-3 rounded'
                            required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full border p-3 rounded'
                            required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full border p-3 rounded'
                            required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border rounded">
                            <option value="customer">
                                Customer
                            </option>
                            <option value="admin">
                                Admin
                            </option>
                        </select>
                    </div>
                    <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
                        Add User
                    </button>
                </form>
            </div>

            {/* user list  */}

            <div className="overflow-x-auto shawdow-md sm:rounded-lg">
                <table className='min-w-full text-gray-500 text-left'>
                    <thead className='bg-gray-100 text-xs uppercase text-gray-500'>
                        <tr>
                            <th className='py-3 px-4'> Name</th>
                            <th className='py-3 px-4'>Email</th>
                            <th className='py-3 px-4'>Role</th>
                            <th className='py-3 px-4'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                           users.map((user)=>{
                            return <tr key={user._id} className='border-b hover:bg-gray-50'>
                                <td className='p-4 font-medium text-gray-500 whitespace-nowrap'>
                                    {user.name}
                                </td>

                                <td className=' p-4'>
                                    {user.email}
                                </td>
                                <td className=' p-4'>
                                    <select value={user.role} onChange={(e)=>handleRoleChange(user._id,e.target.value)} className='p-2 border rounded'>
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className=' p-4'>
                                    <button className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600' onClick={()=>handleDeleteUser(user._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                           }) 
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserManagement