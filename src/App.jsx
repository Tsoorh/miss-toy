import { Route,Routes } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'
import './assets/styles/Main.css'

import { AppHeader } from './components/AppHeader'
import { HomePage } from './pages/HomePage'
import { ToyIndex } from './pages/ToysIndex'
import { ToyDetails } from './components/ToyDetails'
import { ToyEdit } from './components/ToyEdit'
import { UserMsg } from './components/UserMsg'

export default function App() {

  return (
    <HashRouter>
      <section className='main-layout'>
      <header>
      <AppHeader/>
      </header>
      <main>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/toys" element={<ToyIndex/>} />
        <Route path="/toys/:toyId" element={<ToyDetails/>} />
        <Route path="/toy-edit" element={<ToyEdit/>} />
        <Route path="/toy-edit/:toyId" element={<ToyEdit/>} />
      </Routes>
      </main>
      <footer>
      </footer>
      <UserMsg/>
      </section>
    </HashRouter>
  )
}
