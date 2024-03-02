import BadRequestException from "../../exceptions/badRequestException";

export default class SubscriptionDtoService {
  public constructor() {}

  public subscribeDtoCheck(subscription: { rideId: string; userId: string }) {
    if (!subscription.rideId) {
      throw new BadRequestException("rideId can't be empty.");
    }

    if (!subscription.userId) {
      throw new BadRequestException("userId can't be empty.");
    }
  }
}
