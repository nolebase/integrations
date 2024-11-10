declare module '*.yaml' {
  const value: Record<string, any> | Array<Record<string, any>>
  export default value
}
