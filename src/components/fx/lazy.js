import { lazy } from 'react'

// three.js effects are code-split, so the first screen paints without the 3D engine.
export const ProjectCover = lazy(() => import('./ProjectCover'))
