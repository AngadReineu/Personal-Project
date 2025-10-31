import HeroSection from "../components/Layout/Hero";
import Collection from "../components/Products/Collection";
import FeatureCollection from "../components/Products/FeatureCollection";
import FeaturesSections from "../components/Products/FeaturesSections";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";



const placeholderProducts=[
    {
    _id:1,
        name:"product 1",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=1"}]
    },
    {
        _id:2,
        name:"product 2",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=2"}]
    },
    {
        _id:3,
        name:"product 3",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=3"}]
    },
    {
        _id:4,
        name:"product 4",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=4"}]
    },
    {
        _id:5,
        name:"product 5",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=5"}]
    },
    {
        _id:6,
        name:"product 6",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=6"}]
    },
    {
        _id:7,
        name:"product 7",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=7"}]
    },
    {
        _id:8,
        name:"product 8",
        price: 100,
        images:[{url: "https://picsum.photos/500/500?random=8"}]
    },
]


function HomePage() {
    return (
        <div>
            <HeroSection />
            <Collection />
            <NewArrivals />

            <h2 className="text-3xl text-center font-bold mb-4">
                Best Seller
            </h2>
            <ProductDetails />
        
            <div className="container mx-auto">
                <h2 className="text-3xl text-center font-bold mb-4">
                    Top collection for XYZ
                </h2>
                <ProductGrid products={placeholderProducts}/>
            </div>
            <FeatureCollection/>
            <FeaturesSections/>
        </div>
    );
}

export default HomePage;