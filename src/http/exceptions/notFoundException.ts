import GlobalException from "./globalException";

export default class NotFoundException extends GlobalException {
  public constructor(msg: string) {
    super(msg, 404);
  }
}
