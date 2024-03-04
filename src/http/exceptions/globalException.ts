export default class GlobalException extends Error {
  public constructor(msg: string, status: number) {
    super(msg, {
      cause: {
        status: status ?? 500,
      },
    });

    this.message = msg;
  }
}
