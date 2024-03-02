import ConflictException from "../../exceptions/conflictException";
import NotFoundException from "../../exceptions/notFoundException";
import PedalRepository from "../../repositories/pedalRepository";
import SusbcriptionRepository from "../../repositories/subscriptionRepository";
import SubscriptionDtoService from "./subscriptionDtoCheck";
import UserRepository from "../../repositories/userRepository";

export default class SubscriptionService {
  private subscripeDtoService = new SubscriptionDtoService();

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly pedalRepository: PedalRepository,
    private readonly subscriptionRepository: SusbcriptionRepository
  ) {}

  public async create(subscription: { rideId: string; userId: string }) {
    this.subscripeDtoService.subscribeDtoCheck(subscription);

    const doesUserExists = await this.userRepository.findById(
      subscription.userId
    );

    if (!doesUserExists) {
      throw new NotFoundException("User not found.");
    }

    const doesRideExists = await this.pedalRepository.findById(
      subscription.rideId
    );

    if (!doesRideExists) {
      throw new NotFoundException("Ride not found.");
    }

    const maxSubscribersRide = doesRideExists.participantsLimit;
    const totalSubscribersRide = doesRideExists.participantsCount;

    if (totalSubscribersRide === maxSubscribersRide) {
      throw new ConflictException(
        "Ride has reached the maximum subscriptions limit: " +
          totalSubscribersRide
      );
    }

    const doesSubscriptionAlreadyExistsForThisRide =
      await this.subscriptionRepository.findSubscription(subscription);

    if (doesSubscriptionAlreadyExistsForThisRide) {
      throw new ConflictException("User already subscribed to this ride.");
    }

    const doesSubscriberIsRideOwner =
      doesRideExists.pedalOwnerId === subscription.userId;

    if (doesSubscriberIsRideOwner) {
      throw new ConflictException(
        "Ride owner can't subscribe on his own ride."
      );
    }

    this.pedalRepository.insertSubscriber(subscription.rideId);

    if (doesRideExists.startDate < new Date()) {
      throw new ConflictException("This ride has already started or finished.");
    }

    const makeSubscription = await this.subscriptionRepository.save(
      subscription
    );

    return makeSubscription;
  }
}
