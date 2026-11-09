// Stand-in for @hugeicons/react + @hugeicons/core-free-icons used by MagicBento's built-in
// demo visuals. Maps each icon to an equivalent from react-icons so we don't ship another icon pack.
import {
  LuGitBranch,
  LuFingerprint,
  LuKeyRound,
  LuSparkles,
  LuCheck,
} from 'react-icons/lu'
import { SiFigma, SiGithub, SiNotion } from 'react-icons/si'
import { FaSlack as SiSlack } from 'react-icons/fa' // Slack was removed from Simple Icons

export const FigmaIcon = SiFigma
export const FingerPrintIcon = LuFingerprint
export const GitBranchIcon = LuGitBranch
export const GithubIcon = SiGithub
export const Key01Icon = LuKeyRound
export const NotionIcon = SiNotion
export const SlackIcon = SiSlack
export const SparklesIcon = LuSparkles
export const Tick02Icon = LuCheck

export function HugeiconsIcon({ icon: Icon, size = 16, strokeWidth, ...rest }) {
  if (!Icon) return null
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />
}
