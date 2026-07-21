import { describe, expect, it, vi } from 'vitest'
import { createAsyncStartGuard, createSingleRetryGate } from './async-start-guard'

describe('async start guard', () => {
  it('accepts only one start until the active attempt settles', async () => {
    const guard = createAsyncStartGuard()
    let release = () => {}
    const pending = new Promise<void>((resolve) => { release = resolve })
    const start = vi.fn(() => pending)

    const first = guard.run(start)
    const duplicate = await guard.run(start)

    expect(guard.busy).toBe(true)
    expect(duplicate).toBe(false)
    expect(start).toHaveBeenCalledTimes(1)

    release()
    await expect(first).resolves.toBe(true)
    await expect(guard.run(async () => {})).resolves.toBe(true)
    expect(guard.busy).toBe(false)
  })
})

describe('single retry gate', () => {
  it('allows only the first user-activation retry', () => {
    const gate = createSingleRetryGate()

    expect(gate.claimed).toBe(false)
    expect(gate.claim()).toBe(true)
    expect(gate.claim()).toBe(false)
    expect(gate.claimed).toBe(true)
  })
})
