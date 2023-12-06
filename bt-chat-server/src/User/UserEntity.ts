export class User {
  public readonly id: string = '';

  public name: string = '';

  public username: string = '';

  public password: string = '';

  constructor(props: User) {
    Object.assign(this, props);
  }
}
