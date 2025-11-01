

import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByFilter } from '../redux/slice/productSlice';

const Collection = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams])


    const sidebarRef = useRef(null);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductByFilter({ collection, ...queryParams }));
    }, [dispatch, collection, searchParams.toString()]);

    useEffect(() => {
        console.log("Fetched products:", products);
    }, [products]);

    const toggleFilterMobile = () => {
        setFilterOpen(!filterOpen);
    }
    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) { //this means is if the user click within the side bar dont close it ! wala is ulta
            setFilterOpen(false);
        }
    }
    useEffect(() => {
        //event lister for click
        document.addEventListener('mousedown', handleClickOutside);
        //clean the event
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };

    }, []) // this is to close the filter when user click outside





    return (
        <div className='flex flex-col lg:flex-row'>
            {/* mobile filter */}
            <button
                onClick={toggleFilterMobile}
                className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter className='mr-2' />
            </button>

            {/* filter sidebar component */}
            <div
                ref={sidebarRef}
                className={`${filterOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className="flex-grow-0 p-4">
                <h2 className="text-2xl uppercase mb-4">
                    All Collection
                </h2>
                {/* Sort the collection */}
                <SortOptions />

                {/* product grid niche  */}
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    )
}

export default Collection