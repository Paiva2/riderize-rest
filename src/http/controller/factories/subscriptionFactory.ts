import PgPedalModel from "../../model/postgres/PgPedalModel";
import PgSubscriptionModel from "../../model/postgres/PgSubscriptionModel";
import PgUserModel from "../../model/postgres/PgUserModel";
import SubscriptionService from "../../services/subscription/subscriptionService";

export default class SubscriptionFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const subscriptionService = new SubscriptionService(
      models.userModel,
      models.pedalModel,
      models.subscriptionModel
    );

    return subscriptionService;
  }

  private models() {
    const userModel = new PgUserModel();
    const pedalModel = new PgPedalModel();
    const subscriptionModel = new PgSubscriptionModel();

    return {
      userModel,
      pedalModel,
      subscriptionModel,
    };
  }
}
