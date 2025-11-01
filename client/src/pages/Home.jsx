import { useDispatch, useSelector } from "react-redux";
import HeroSection from "../components/Layout/Hero";
import Collection from "../components/Products/Collection";
import FeatureCollection from "../components/Products/FeatureCollection";
import FeaturesSections from "../components/Products/FeaturesSections";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useEffect, useState } from "react";
import { fetchProductByFilter } from "../redux/slice/productSlice";
import axios from "axios";







function HomePage() {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state)=>state.products);
    const[bestSellerProducts, setBestSellerProducts] = useState(null);

    useEffect(()=>{
        //fetch products for a specific collection
        dispatch(
            fetchProductByFilter({
                gender:"Women",
                category:"Suit",
                limit:6,
            })
        );
        //fetch the best seller 
        const fetchBestSeller = async()=>{
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
                console.log("Best seller response:", response.data);
                setBestSellerProducts(response.data);
            } catch (error) {
                console.error(error);
            };
           
        }
         fetchBestSeller();
    },[dispatch])
    
    return (
        <div>
            <HeroSection />
            <Collection />
            <NewArrivals />

            <h2 className="text-3xl text-center font-bold mb-4">
                Best Seller
            </h2>
            {bestSellerProducts? (<ProductDetails productId={bestSellerProducts._id}/> ):( <p className="text-center">Loading best seller product....</p>)}
            
        
            <div className="container mx-auto">
                <h2 className="text-3xl text-center font-bold mb-4">
                    Top collection for XYZ
                </h2>
                <ProductGrid products={products} loading={loading} error={error}/>
            </div>
            <FeatureCollection/>
            <FeaturesSections/>
        </div>
    );
}

export default HomePage;