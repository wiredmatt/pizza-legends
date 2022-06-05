export default {
  withGrid: (n: number) => n * 16,
  capitalize: (_str: string) =>
    _str.charAt(0).toUpperCase() + _str.slice(1)
}
