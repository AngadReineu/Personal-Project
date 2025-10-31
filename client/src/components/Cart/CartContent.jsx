import {RiDeleteBin3Line} from "react-icons/ri" 


function CartContent() {
    const cartProducts = [
        {
            productId: 1,
            name: "T-shirt",
            color: "Red",
            size: "L",
            quantity: 1,
            price: 15,
            image: "https://picsum.photos/200?random=1",

        },
        {
            productId: 2,
            name: "jeans",
            color: "blue",
            size: "L",
            quantity: 1,
            price: 25,
            image: "https://picsum.photos/200?random=1",

        },

    ]
    return (
        <div>
            {
                cartProducts.map((cartItems, index) => (
                    <div key={index} className="flex items-start justify-between py-4 border-b">
                        <div className="flex items-start">
                            <img
                                src={cartItems.image}
                                alt={cartItems.name}
                                className="w-20 h-24 object-cover mr-4 rounded" />
                            <div>
                                <h3>{cartItems.name}</h3>
                                <p className="text-sm text-gray-500">
                                    size:{cartItems.size} | color: {cartItems.color}
                                </p>
                                <div className="flex items-center mt-2">
                                    <button className="border rounded px-2 py-1 text-xl font-medium">
                                        -
                                    </button>
                                    <span className="mx-4">{cartItems.quantity}</span>
                                    <button className="border rounded px-2 py-1 text-xl font-medium">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>${cartItems.price.toLocaleString()}</p>
                            <button>
                                <RiDeleteBin3Line className=" h-6 w-6 mt-2 text-red-600"/>
                            </button>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default CartContent;