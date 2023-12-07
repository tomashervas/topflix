import { cookies } from "next/headers"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Script from "next/script"

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
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/castjs/5.2.0/cast.min.js" />
    </div>
  )
}
export default Layout