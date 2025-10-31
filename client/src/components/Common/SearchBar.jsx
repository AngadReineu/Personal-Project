import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";




function SearchBar() {

    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    function handleSearchToggle() {
        setIsOpen(!isOpen);
    };

    function handleFormSubmit(e){
        e.preventDefault();
        console.log("seach term:", search);
        setIsOpen(false); // form gets closed onces we submit
        
    };
    
    return (
        //search should only be opened if the state is true so 

        <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"}`}>
            {
                isOpen ?
                    (
                        <form onSubmit={handleFormSubmit} className="relative flex items-center justify-center w-full">
                            <div className="relative w-1/2">
                                <input type="text"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e)=>setSearch(e.target.value)}
                                    className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full text-gray-700" />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                <HiMagnifyingGlass className="h-6 w-6" />
                            </button>
                            </div>
                            {/* //close icon  */}
                            <button type="button" className="absolute right-15 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 " onClick={handleSearchToggle}><HiMiniXMark className=" h-6 w-6 "/></button>

                        </form>) : (
                        <button onClick={handleSearchToggle} className="h-6 w-6">
                            <HiMagnifyingGlass />
                        </button>
                    )
            }
        </div>

    );
}

export default SearchBar;