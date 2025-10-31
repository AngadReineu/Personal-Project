import TopBar from "../Layout/Topbar";
import NavBar from "./Navbar";




function Header() {
    return (
    <header className="border-b border-gray-200">
        {/* topbar */}
        <TopBar/>
        {/* navbar */}
        <NavBar/>
        {/* cart drawer */}
    </header>  );
}

export default Header;
 