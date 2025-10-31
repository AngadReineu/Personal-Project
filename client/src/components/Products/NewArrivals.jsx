import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";


function NewArrivals() {

    const scrollRef = useRef(null);
    const [isDraggin, setIsDraggin] = useState(false);
    const [canscrollLeft, setCanScrollLeft] = useState(false);
    const [startX, setStartX] = useState(0); // this is the starting value when user starts to grab and scoll the container
    const [scrollLeft, setScrollLeft] = useState(false); // initial scroll from the left
    const [canscrollRight, setCanScrollRight] = useState(true); // this is to determine if the cntainer can be scroll to the right

    const newArr = [
        {
            _id: "1",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=1",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "2",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=2",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "3",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=3",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "4",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=4",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "5",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=5",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "6",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=6",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "7",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=7",
                    altText: "Stylish Meme"
                },
            ],
        },
        {
            _id: "8",
            name: "Stylish Meme",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?random=8",
                    altText: "Stylish Meme"
                },
            ],
        },
    ];

    // need a function too for the scroll buttons that takea direction left or right
    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = direction == "left" ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setTimeout(() => { // when you click your arrow buttons, you’re not manually scrolling you’re calling
            //this isHey React, wait a few milliseconds for the smooth scroll to finish, then recheck and update whether scrolling left or right is still possible
            const leftScroll = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(leftScroll < maxScrollLeft - 1);
        }, 300);
    }
    const updateScrollButtons = () => {
        const container = scrollRef.current;
        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
        console.log({
            scrollLeft: container.scrollLeft,
            clientWidth: container.clientWidth,
            containerScrollWidth: container.scrollWidth,
            offsetLeft:scrollRef.current.offsetLeft
        });
    }

    const handleMouseDown=(e)=>{
        setIsDraggin(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft) // this will give us the horizotal position of the pointer .
        setScrollLeft(scrollRef.current.scrollLeft); // these vlaues are needed when the user will move the mouse horizontally & set the position of the container
    } //offset is the distance of the left page of the child and the parent
    

    const handleMouseMove =(e)=>{
        if(!isDraggin) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x-startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
        
    }

    const handleMouseUpOrGetOut=(e)=>{
        setIsDraggin(false);
    }




    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }


    }, []);
    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">
                    Explore new Arrivals
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off the runway,freshly added to keep you meme on the cutting edge of instagram
                </p>

                {/* scroll button */}
                {/* //can add border in the style */}

                <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canscrollLeft}
                        className={`p-2 rounded ${canscrollLeft ? " bg-white text-black cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"} `}>
                        <FiChevronLeft className="text-2xl " />
                    </button>
                    <button
                    onClick={()=>scroll("right")}
                        className={`p-2 rounded ${canscrollRight ? " bg-white text-black cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"} `}>
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* scoll content */}
            <div
                ref={scrollRef}
                // this is or dragging with mouse bruh//
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrGetOut}
                onMouseLeave={handleMouseUpOrGetOut}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDraggin? "cursor-grabbing": "cursor-grab"}`}
            >
                {
                    newArr.map((newArrivals) => (
                        <div key={newArrivals._id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative">
                            <img
                                src={newArrivals.images[0]?.url}
                                alt={newArrivals.images[0]?.altText || newArrivals.name}
                                className="w-full h-[500px] object-cover rounded-lg"
                                draggable="false"
                            />
                            <div className="absolute bottom-0 right-0 left-0 opacity-95 backdrop-blur-md text-white p-4 rounded-b-lg">
                                <Link to={`/product/${newArrivals._id}`} className="block">
                                    <h4 className="font-medium">{newArrivals.name}</h4>
                                    <p className="mt-1">${newArrivals.price}</p>
                                </Link>

                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}

export default NewArrivals;