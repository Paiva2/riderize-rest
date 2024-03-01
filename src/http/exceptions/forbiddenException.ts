import GlobalException from "./globalException";

export default class ForbiddenException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 403);
  }
}
