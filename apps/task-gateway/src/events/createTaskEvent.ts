/* eslint-disable prettier/prettier */
export class CreateTaskEvent {
  constructor(
    public readonly user: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: string,
    public readonly dueDate: Date,
    public readonly isComplete: boolean,
  ) {}
}
