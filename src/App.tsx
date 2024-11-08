import { useState } from 'react'
import WindowVirtualList from './WindowVirtualList'
import StaticVirtualList from './StaticVirtualList'

export default function App () {
  const [tab, setTab] = useState<'window' | 'static'>('static')
  return (
    <div>
      <h1>List Vitualization</h1>
      <button onClick={() => setTab('window')}>window</button>
      <button onClick={() => setTab('static')}>static</button>
      {tab === 'window' && <WindowVirtualList />}
      {tab === 'static' && <StaticVirtualList />}
    </div>
  )
}
