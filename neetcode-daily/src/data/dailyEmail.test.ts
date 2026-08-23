import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { problems } from './problems'
import {
  buildDailyEmail,
  getDailyEmailProblem,
  parseUtcDateKey,
  utcDateKey,
} from './dailyEmail'

describe('daily email digest', () => {
  it('uses UTC YYYY-MM-DD keys', () => {
    const date = new Date('2026-08-23T22:15:00.000Z')
    assert.equal(utcDateKey(date), '2026-08-23')
    assert.equal(parseUtcDateKey('2026-08-23').toISOString(), '2026-08-23T00:00:00.000Z')
  })

  it('picks one stable problem per UTC day', () => {
    const morning = new Date('2026-08-23T00:30:00.000Z')
    const evening = new Date('2026-08-23T23:59:00.000Z')
    const a = getDailyEmailProblem(morning)
    const b = getDailyEmailProblem(evening)
    assert.equal(a.id, b.id)
    assert.equal(typeof a.name, 'string')
    assert.ok(a.name.length > 0)
  })

  it('cycles through distinct problems across the list', () => {
    const start = Date.parse('2026-01-01T00:00:00.000Z')
    const ids = new Set<number>()
    for (let i = 0; i < problems.length; i += 1) {
      ids.add(getDailyEmailProblem(new Date(start + i * 86_400_000)).id)
    }
    assert.equal(ids.size, problems.length)
  })

  it('includes the question and topic hints in html and text', () => {
    const digest = buildDailyEmail(new Date('2026-08-23T12:00:00.000Z'))
    assert.match(digest.subject, /^NeetDaily · /)
    assert.equal(digest.dateKey, '2026-08-23')
    assert.ok(digest.html.includes(digest.problem.name))
    assert.match(digest.html, /Topic hints/)
    assert.ok(digest.html.includes(digest.hints.pattern))
    assert.match(digest.html, /Python tools/)
    assert.ok(digest.text.includes(digest.problem.name))
    assert.ok(digest.text.includes(digest.hints.tip))
    assert.ok(digest.text.includes(digest.problem.leetcodeUrl))
    assert.ok(digest.hints.concepts.length > 0)
  })
})
