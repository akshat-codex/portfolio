import { lazy } from 'react'

// Everything that pulls in three.js is code-split, so the first screen paints
// without downloading or parsing the 3D engine.
export const Scene3D = lazy(() => import('./Scene3D'))
export const ProjectCover = lazy(() => import('./ProjectCover'))
export const LiquidName = lazy(() => import('./LiquidName'))
