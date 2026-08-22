function Navbar(){
    return(
        <nav className="h-[100px] flex items-center px-[8%]">
            <div className="w-[140px]">
                <img src="/download.svg" alt="Megasale Logo"/>
            </div>

            <ul className="flex-1 flex justify-center gap-[30px] list-none">
                <li><a href="#" className="text-[#333] no-underline px-[10px] py-[10px]">Home</a></li>
                <li><a href="#" className="text-[#333] no-underline px-[10px] py-[10px]">Collection</a></li>
                <li><a href="#" className="text-[#333] no-underline px-[10px] py-[10px]">Blog</a></li>
                <li><a href="#" className="text-[#333] no-underline px-[10px] py-[10px]">About</a></li>
                <li><a href="#" className="text-[#333] no-underline px-[10px] py-[10px]">Contact Us</a></li>
            </ul>

            <div className="flex items-center gap-[25px] ml-[40px]">
                <a href="#" className="text-[#333] text-[20px]">
                    <i className="fa-regular fa-bookmark"></i>
                </a>
                <a href="#" className="text-[#333] text-[20px]">
                   <i className="fa-solid fa-cart-shopping"></i>
                </a>

                <a href="#" className="text-[#333] text-[20px]">
                   <i className="fa-regular fa-circle-user"></i>
                </a>
            </div>
            
        </nav>
    )
}

export default Navbar