export const filterObject = (obj: object, predicate: Function): object => {
  const objKeys = Object.keys(obj)

  return objKeys.reduce(
    (acc: object, key: string) => {
      const newAcc = { ...acc }
      if (predicate(obj[key])) newAcc[key] = obj[key]
      return newAcc
    },
    {}
  )
}

export const hourFromNow = () => (new Date().getTime() + (1000 * 60 * 60));