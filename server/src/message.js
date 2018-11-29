import { Users } from './user-register';

export class Message {
  constructor(user, message) {
    this.user = user.username;
    this.message = message;
    this.time = Date.now();
  }

  get text() {
    return `${this.user}:${this.time}:${this.message}`;
  }

  static build(username, message) {
    const user = Users.getUser(username);
    if (!message) {
      throw new Error("Message blank");
    }
    if (!user) {
      throw new Error("User invalid");
    }

    return new Message(user, message);

  }




}