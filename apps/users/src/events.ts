/* eslint-disable prettier/prettier */
export class CreateUserEvent {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly type: string,
  ) {}
}
