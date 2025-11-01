export class UserDto {
  constructor(
    public readonly id: number,
    public readonly displayName: string,
    public readonly avatarUrl: string,
    public readonly originWorld: string,
    public readonly isAlive: boolean,
  ) {}
}
