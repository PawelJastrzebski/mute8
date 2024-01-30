import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import CarStore from './CarStore.tsx'
import { Provider, createStore } from 'mute8-react'

const testStore = createStore({
  value: {
    text: "Hello World"
  },
  actions: {
    async changeText(text: string) {
      this.text = text;
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={testStore}>
      <App />
      <CarStore />
    </Provider>
  </React.StrictMode>,
)
