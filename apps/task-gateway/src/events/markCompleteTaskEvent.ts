/* eslint-disable prettier/prettier */
export class MarkTaskAsComplete {
  constructor(
    public readonly taskId: string,
    public readonly userId: string,
  ) {}
}
