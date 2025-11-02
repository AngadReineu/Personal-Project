


import { Link } from 'react-router-dom'
import featuredPic from "../../assets/ice.jpg"



const FeatureCollection = () => {
    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl'>
                {/* left written stuff */}
                <div className="lg:w-1/2 p-8 text-center lg:text-left">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                        XYZ THIGNS
                    </h2>
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                        Made for every Thing
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Discover all categorical stuff in this wbsite dawg gotta write more stuff so that it can wrap in 2nd line you feel me dawg.
                    </p>
                    <Link to="/collections/all" className='bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800'>
                        Shop Now
                    </Link>
                </div>
            {/* right photo side */}

            <div className="lg:w-1/2 ">
                <img 
                src={featuredPic} 
                alt="Featured Product"
                className='w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl' />
            </div>


            </div>
        </section>
    )
}

export default FeatureCollection