import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filterStore, setFilterStore] = useState({
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    const [priceRange, setPriceRange] = useState([0, 100]);

    const categories = ["Top Class", "Avg Class"];
    const colors = ["Red", "Blue", "Black", "Green", "Yellow", "Gray", "White", "Pink", "Beige"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const materials = ["Carbon Fiber", "Aluminium", "Alloys", "Full Metal Build"];
    const brands = ["Suzuki", "Porche", "Pagani", "Volkwagen", "Ferrari", "Lamborghini"];
    const genders = ["Male", "Female"];

    const handleFilterChange=(e)=>{
        const {name, value, checked, type} = e.target;
        console.log({name,value, checked, type});
        //to ensure multiple values ae stored in one filter
        let newFilter = {...filterStore};
        if(type === "checkbox"){
            if(checked){ //if this is true then we wnat to add new value to the existing value of the array 
                newFilter[name] =[...(newFilter[name]) || [], value];
            } else{
                newFilter[name] = newFilter[name].filter((item)=> item !== value) // this is for if i have multiple selected then when i uncheck some it should be removed from the array
            }
        } else{
            newFilter[name] = value;
        }
        setFilterStore(newFilter);
        console.log(newFilter);
        updateUrlParams(newFilter)
        
        

    };
    // for url

    const updateUrlParams=(newFilter)=>{
        const params = new URLSearchParams();
        Object.keys(newFilter).forEach((key) =>{
            if(Array.isArray(newFilter[key]) && newFilter[key].length > 0){
                params.append(key, newFilter[key].join(","));
            } else if(newFilter[key]){
                params.append(key, newFilter[key]);
            }
        });
        setSearchParams(params)
        navigate(`?${params.toString()}`);
    };

    const handlePrinceRange=(e)=>{
        const newPrice = e.target.value;
        setPriceRange([0, newPrice])
        const newFilter={...filterStore, minPrice: 0, maxPrice: newPrice};
        setFilterStore(filterStore);
        updateUrlParams(newFilter);
    }

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        setFilterStore({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 100,
        });
        setPriceRange([0, params.maxPrice || 100]);
    }, [searchParams]); //  Added dependency so it updates when URL changes

    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
                Filter
            </h3>
            {/* categories */}
            <div className='mb-6'>
                <label className="block text-gray-600 font-medium mb-2">Category{" "}:</label>
                {
                    categories.map((category) => (
                        <div key={category} className='flex items-center mb-1'>
                            <input
                                type="radio"
                                name='category'
                                value={category}
                                onChange={handleFilterChange}
                                checked={filterStore.category === category}
                                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 cursor-pointer border-gray-300 transition hover:scale-105'
                            />
                            <span className='text-gray-700'>
                                {
                                    category
                                }
                            </span>

                        </div>
                    ))
                }

            </div>
            {/* gender */}
            <div className='mb-6'>
                <label className="block text-gray-600 font-medium mb-2">Gender{" "}:</label>
                {
                    genders.map((gender) => (
                        <div key={gender} className='flex items-center mb-1'>
                            <input
                                type="radio"
                                name='gender'
                                value={gender}
                                onChange={handleFilterChange}
                                checked={filterStore.gender === gender}
                                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 cursor-pointer border-gray-300 transition hover:scale-105'
                            />
                            <span className='text-gray-700'>
                                {
                                    gender
                                }
                            </span>

                        </div>
                    ))
                }

            </div>

            {/* color */}
            <div className="mb-6">
                <label className='block text-gray-600 font-medium mb-2'>Color{" "}:</label>
                <div className="flex flex-wrap gap-2">
                    {
                        colors.map((color) => {
                            return <button
                                key={color}
                                name={color}
                                value={color}
                                onClick={handleFilterChange}
                                className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filterStore.color === color? "ring-2 ring-blue-500": ""}`}
                                style={{ backgroundColor: color.toLowerCase() }}>

                            </button>
                        })
                    }
                </div>
            </div>

            {/* size */}
            <div className="mb-6 ">
                <label className='block text-gray-600 font-medium mb-2'>Size {" "}:</label>

                <div className='flex flex-wrap gap-5'> {/*can remove this div to make it vertical*/ }
                    {

                        sizes.map((size) => {
                            return <div key={size} className='flex items-center mb-1'>
                                <input
                                    type="checkbox"
                                    name='size'
                                    value={size}
                                    checked={filterStore.size.includes(size)}
                                    onChange={handleFilterChange}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 transition hover:scale-105 cursor-pointer'
                                />
                                <span className='text-gray-700'>{size}</span>
                            </div>
                        })
                    }
                </div>
            </div>
            {/* material */}
            <div className="mb-6 ">
                <label className='block text-gray-600 font-medium mb-2'>Materials {" "}:</label>
                    {
                        materials.map((material) => {
                            return <div key={material} className='flex items-center mb-2'>
                                <input
                                    type="checkbox"
                                    name='material'
                                    value={material}
                                    onChange={handleFilterChange}
                                    checked={filterStore.material.includes(material)}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 transition hover:scale-105 cursor-pointer'
                                />
                                <span className='text-gray-700'>{material}</span>
                            </div>
                        })
                    }
                
            </div>
            {/* brand */}
            <div className="mb-6 ">
                <label className='block text-gray-600 font-medium mb-2'>Brands {" "}:</label>
                    {
                        brands.map((brand) => {
                            return <div key={brand} className='flex items-center mb-2'>
                                <input
                                    type="checkbox"
                                    name='brand'
                                    value={brand}
                                    onChange={handleFilterChange}
                                    checked={filterStore.brand.includes(brand)}
                                    className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 transition hover:scale-105 cursor-pointer'
                                />
                                <span className='text-gray-700'>{brand}</span>
                            </div>
                        })
                    }
                
            </div>


            {/* price range */}
            <div className="mb-8">
                <label className='block text-gray-600 font-medium mb-2'> Price Range {" "}:</label>
                <input 
                type="range"
                name='priceRange'
                value={priceRange[1]}
                onChange={handlePrinceRange}
                min={0}
                max={100}
                className='w-full h-2 bg-gray-300 rounded-lg cursor-pointer appearance-none'
                />
                <div className="flex justify-between text-gray-600 mt-2">
                    <span className="">${priceRange[0]}</span>
                    <span className="">${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
