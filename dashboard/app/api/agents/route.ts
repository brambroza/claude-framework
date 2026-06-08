import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

export interface AgentInfo {
  id: string
  name: string
  description: string
  model: string
  memory: string | null
  phase: string
  source: 'user' | 'project'
}

const PHASE_MAP: Record<string, string> = {
  'sales-consultant': 'presales',
  'product-brand-strategist': 'presales',
  'software-sales-marketing-advisor': 'presales',
  'solution-architect': 'planning',
  'tech-architect': 'planning',
  'project-manager': 'planning',
  'backend-dev': 'delivery',
  'frontend-dev': 'delivery',
  'frontend-mui-expert': 'delivery',
  'code-reviewer': 'delivery',
  'dba': 'delivery',
  'devops': 'delivery',
  'security-auditor': 'delivery',
  'software-tester-reporter': 'delivery',
  'senior-backend-architect': 'delivery',
  'doc-writer': 'handover',
  'support-agent': 'support',
  'org-advisor': 'all',
  'software-ceo-strategist': 'all',
}

/**
 * Parse YAML frontmatter — handles simple key: value and quoted strings.
 * Does not handle multiline blocks (not needed for agent files).
 */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const result: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1 || line.startsWith(' ') || line.startsWith('-')) continue
    const key = line.slice(0, colonIdx).trim()
    const raw = line.slice(colonIdx + 1).trim()
    if (!raw) continue
    result[key] = raw.replace(/^["']/, '').replace(/["']$/, '')
  }
  return result
}

function shortDescription(desc: string): string {
  // Strip escaped newlines and example blocks — keep only first sentence
  const clean = desc
    .replace(/\\n[\s\S]*/g, '')   // cut at first \n escape
    .replace(/<example>[\s\S]*/g, '') // cut before example blocks
    .trim()
  return clean.length > 120 ? clean.slice(0, 117) + '…' : clean
}

function readAgentsFromDir(dir: string, source: 'user' | 'project'): AgentInfo[] {
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .flatMap((file): AgentInfo[] => {
      try {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8')
        const fm = parseFrontmatter(content)
        const name = fm.name || file.replace('.md', '')
        return [{
          id: `${source}-${name}`,
          name,
          description: shortDescription(fm.description || ''),
          model: fm.model || 'inherit',
          memory: fm.memory || null,
          phase: PHASE_MAP[name] || 'all',
          source,
        }]
      } catch {
        return []
      }
    })
}

export async function GET() {
  const userAgentsDir = path.join(os.homedir(), '.claude', 'agents')
  const projectAgentsDir = path.join(process.cwd(), '..', '.claude', 'agents')

  const agents = [
    ...readAgentsFromDir(userAgentsDir, 'user'),
    ...readAgentsFromDir(projectAgentsDir, 'project'),
  ]

  // Deduplicate by name — project-level overrides user-level
  const seen = new Set<string>()
  const deduplicated = agents.filter(a => {
    if (seen.has(a.name)) return false
    seen.add(a.name)
    return true
  })

  return NextResponse.json(deduplicated)
}
