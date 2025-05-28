import Home from './pages/Home'
import IntentManager from './pages/IntentManagement'

import { Routes, Navigate, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route  path='/intents_manager' element={<IntentManager/>}/>
    </Routes>
  )
}

export default App
