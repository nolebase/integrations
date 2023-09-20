export function attemptWithDelay<T>(maxTryIterate: number, delayMs: number, attempt: () => (T | null) | Promise<T | null>): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    let tryIterate = 0

    function attemptWithDelayInner() {
      tryIterate++

      try {
        const result = attempt()

        if (result instanceof Promise) {
          result.then((result) => {
            if (result)
              resolve(result)
            else if (tryIterate < maxTryIterate)
              setTimeout(attemptWithDelayInner, delayMs)
            else
              resolve(null)
          }).catch((e) => {
            if (tryIterate < maxTryIterate)
              setTimeout(attemptWithDelayInner, delayMs)
            else
              reject(e)
          })
        }
        else {
          if (result)
            resolve(result)
          else if (tryIterate < maxTryIterate)
            setTimeout(attemptWithDelayInner, delayMs)
          else
            resolve(null)
        }
      }
      catch (e) {
        if (tryIterate < maxTryIterate)
          setTimeout(attemptWithDelayInner, delayMs)
        else
          reject(e)
      }
    }

    attemptWithDelayInner()
  })
}
