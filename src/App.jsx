import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import AboutUs from './sections/AboutUs'
import Recognition from './sections/Recognition'
import Services from './sections/Services'
import Therapist from './sections/Therapist'
import FAQ from './sections/FAQ'
import Testimonials from './sections/Testimonials'
import BookSession from './sections/BookSession'
import Footer from './sections/Footer'
import BlogsPage from './pages/BlogsPage'

const AdminBlogsPage = lazy(() => import('./pages/AdminBlogsPage'))

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/blogs') {
    return <><Navbar /><BlogsPage /></>
  }

  if (path === '/admin' || path === '/admin/blogs') {
    return (
      <>
        <Navbar />
        <Suspense fallback={<p className="route-loading" role="status">Loading editor…</p>}>
          <AdminBlogsPage />
        </Suspense>
      </>
    )
  }

  return (<><Navbar /><main><Hero /><AboutUs /><Recognition /><Services /><Therapist /><FAQ /><Testimonials /><BookSession /></main><Footer /></>)
}
