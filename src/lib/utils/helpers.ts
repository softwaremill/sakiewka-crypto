export const filterObject = (obj: object, predicate: Function) => {
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
