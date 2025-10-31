

import React, { useEffect, useRef, useState } from 'react'
import {FaFilter} from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';

const Collection = () => {

    const [product, setProducts] = useState([]);
    const sidebarRef = useRef(null);
    const[filterOpen, setFilterOpen] = useState(false);

    const toggleFilterMobile =()=>{
        setFilterOpen(!filterOpen);
    }
    const handleClickOutside =(e)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){ //this means is if the user click within the side bar dont close it ! wala is ulta
            setFilterOpen(false);
        }
    }
    useEffect(()=>{
        //event lister for click
        document.addEventListener('mousedown', handleClickOutside);
        //clean the event
        return()=>{
            document.removeEventListener("mousedown",handleClickOutside )
        };
        
    },[]) // this is to close the filter when user click outside


    useEffect(() => {
        setTimeout(() => {
            const fetchProducts = [
                {
                    _id: 1,
                    name: "product 1",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=1" }]
                },
                {
                    _id: 2,
                    name: "product 2",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=2" }]
                },
                {
                    _id: 3,
                    name: "product 3",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=3" }]
                },
                {
                    _id: 4,
                    name: "product 4",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=4" }]
                },
                {
                    _id: 5,
                    name: "product 5",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=5" }]
                },
                {
                    _id: 6,
                    name: "product 6",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=6" }]
                },
                {
                    _id: 7,
                    name: "product 7",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=7" }]
                },
                {
                    _id: 8,
                    name: "product 8",
                    price: 100,
                    images: [{ url: "https://picsum.photos/500/500?random=8" }]
                },
            ]; 
            setProducts(fetchProducts);
        }, 1000)
    }, [])


    return (
        <div className='flex flex-col lg:flex-row'>
            {/* mobile filter */}
            <button 
            onClick={toggleFilterMobile}
            className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter className='mr-2'/>
            </button>

            {/* filter sidebar component */}
            <div 
            ref={sidebarRef} 
            className={`${filterOpen? "translate-x-0":"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar/>
            </div>
            <div className="flex-grow-0 p-4">
                <h2 className="text-2xl uppercase mb-4">
                    All Collection
                </h2>
                {/* Sort the collection */}
                <SortOptions/>

                {/* product grid niche  */}
                <ProductGrid products={product}/>
            </div>
        </div>
    )
}

export default Collection