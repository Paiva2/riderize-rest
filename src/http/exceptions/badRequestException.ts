import GlobalException from "./globalException";

export default class BadRequestException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 400);
  }
}
