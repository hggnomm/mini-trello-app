import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import Modal from 'react-modal'
import './index.css'
import App from './App.tsx'
import { store } from './store/index.ts'

Modal.setAppElement('#root')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
