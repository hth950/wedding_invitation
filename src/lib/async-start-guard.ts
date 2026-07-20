export function createAsyncStartGuard() {
  let busy = false

  return {
    get busy() {
      return busy
    },
    async run(start: () => Promise<void>): Promise<boolean> {
      if (busy) return false
      busy = true
      try {
        await start()
        return true
      } finally {
        busy = false
      }
    },
  }
}
