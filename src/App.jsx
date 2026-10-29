import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import AboutUs from './sections/AboutUs'
import Services from './sections/Services'
import Therapist from './sections/Therapist'
import FAQ from './sections/FAQ'
import Testimonials from './sections/Testimonials'
import BookSession from './sections/BookSession'
import Footer from './sections/Footer'
import BlogsPage from './pages/BlogsPage'
import AdminBlogsPage from './pages/AdminBlogsPage'

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/blogs') {
    return <><Navbar /><BlogsPage /></>
  }

  if (path === '/admin/blogs') {
    return <><Navbar /><AdminBlogsPage /></>
  }

  return (<><Navbar /><main><Hero /><AboutUs /><Services /><Therapist /><FAQ /><Testimonials /><BookSession /></main><Footer /></>)
}
