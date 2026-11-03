import React from 'react'
import Scene from './scene/Scene.jsx'
import { TopBar, Intro, Panel, Nav } from './ui/Ui.jsx'
import { Sorter } from './ui/Sorter.jsx'
import { AuthorBar } from './ui/AuthorBar.jsx'
import { Floors } from './ui/Floors.jsx'
import { useKeys } from './ui/keys.js'

export default function App() {
  useKeys()
  return (
    <>
      <Scene />
      <TopBar />
      <Panel />
      <Nav />
      <Floors />
      <AuthorBar />
      <Intro />
      <Sorter />
    </>
  )
}
