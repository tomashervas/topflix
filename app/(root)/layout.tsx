import { cookies } from "next/headers"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"

const Layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  return (
    <div className="flex flex-col justify-between min-h-full">
        <Navbar />
        {children}
      <Footer/>
    </div>
  )
}
export default Layout