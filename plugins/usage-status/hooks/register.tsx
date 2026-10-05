import type { Register } from 'claude-code'

const LABEL: Record<string, string> = { five_hour: '5h', seven_day: '1w' }

// ponytail: the desktop footer ignores Box gaps and drops whitespace-only text, so space with a
// braille blank + quarter-em space, and a zero-width space + quarter-em space for the smaller gap
const GAP = '⠀ '
const HALF_GAP = '\u200b\u2005'

const colorOf = (pct: number) => (pct >= 90 ? '#e5534b' : pct >= 70 ? '#d29922' : undefined)
const PCT_COLOR: Record<string, string> = { five_hour: '#56b4e9', seven_day: '#2ec4a0' }
// the footer mutes plain text; the theme's own text color matches the model name beside it
const TEXT = 'text'

const resetLabel = (iso: string, now: number) => {
  const d = new Date(iso)
  return d.toDateString() === new Date(now).toDateString()
    ? d.toTimeString().slice(0, 5)
    : `${d.getMonth() + 1}/${d.getDate()}`
}

export const register: Register = on => {
  on('session.measure', ($, e, next) => {
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    const { rateLimits } = await $.session.usage()
    if (rateLimits.length === 0) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const now = await $.clock.now()
    const modes = e.props.modes.join(' & ')

    return (
      <Box>
        {modes && <Text color={TEXT}>{modes}</Text>}
        {rateLimits.map((r, i) => {
          const color = colorOf(r.percentUsed)
          // weekly reset always; the others only near the limit
          const showReset = r.resetsAt && (color || r.kind === 'seven_day')
          return (
            <Box key={r.kind} gap={1}>
              <Text color={TEXT}>{(i > 0 || modes ? GAP : '') + (LABEL[r.kind] ?? r.kind)}</Text>
              <Text bold={!!color} color={color ?? PCT_COLOR[r.kind] ?? TEXT}>{Math.round(r.percentUsed)}%</Text>
              {showReset && (
                <Text color={color ?? TEXT}>{`${HALF_GAP}↻\u2005${resetLabel(r.resetsAt!, now)}`}</Text>
              )}
            </Box>
          )
        })}
      </Box>
    )
  })
}
