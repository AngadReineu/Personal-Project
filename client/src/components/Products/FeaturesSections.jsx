
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const FeaturesSections = () => {
  return (
    <section className="py-16 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* first feature */}
            <div className='flex flex-col items-center'>
                <div className="p-4 rounded-full mb-4">
                    <HiShoppingBag className="text-xl"/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                    FREE SHIPPING WORLD WIDE NIGGA
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    For Poor Niggas
                </p>

            </div>
            {/* second feature */}
            <div className='flex flex-col items-center'>
                <div className="p-4 rounded-full mb-4">
                    <HiArrowPathRoundedSquare className="text-xl"/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                    67 Days return
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    Money back no guarantee
                </p>

            </div>
            {/* third feature */}
            <div className='flex flex-col items-center'>
                <div className="p-4 rounded-full mb-4">
                    <HiOutlineCreditCard className="text-xl"/>
                </div>
                <h4 className='tracking-tighter mb-2'>
                    SECURE CHECKOUT NO SCAM
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    100% NO SCAM
                </p>

            </div>
        </div>
    </section>
  )
}

export default FeaturesSections