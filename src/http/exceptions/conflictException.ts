import GlobalException from "./globalException";

export default class ConflictException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 409);
  }
}
