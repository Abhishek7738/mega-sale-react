import Navbar from "./components/Navbar"
import TopBar from "./components/TopBar"
import Hero from "./components/Hero"
import PromoSection from "./components/PromoSection"
import Categories from "./components/Categories"
import ThreeDemo from "./components/ThreeDemo"

function App() {
  return (
    <div>
      <TopBar/>
      <Navbar />
      <Hero/>
     <PromoSection/>
     <Categories/>
     <ThreeDemo/>
    </div>
  )
}

export default App