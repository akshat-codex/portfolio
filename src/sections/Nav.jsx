import { useState } from 'react'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from '@/components/vendor/aceternity/resizable-navbar'
import { TextRoll } from '@/components/vendor/skiper/skiper58'
import { navLinks, profile } from '@/data/content'

/** Aceternity · Resizable Navbar: full-width bar that shrinks into a floating pill on scroll. */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const items = navLinks.map((l) => ({ name: l.label, link: l.href }))
  const close = () => setOpen(false)

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={items} />
        <NavbarButton href={profile.cvHref} download={profile.cvDownloadName} variant="primary" className="relative z-20">
          {profile.cvLabel}
        </NavbarButton>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={open} onClick={() => setOpen((o) => !o)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={open} onClose={close}>
          <nav aria-label="Sections" className="w-full">
            <ul className="grid w-full gap-1">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={l.href} onClick={close} className="flex items-baseline gap-4 py-2 text-paper">
                    <span className="label num text-signal">{l.index}</span>
                    <TextRoll className="text-3xl font-black uppercase tracking-tight">{l.label}</TextRoll>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <NavbarButton href={profile.cvHref} download={profile.cvDownloadName} variant="primary" className="w-full">
            {profile.cvLabel}
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
