export interface IInitable {
  init: () => Promise<void>
}
