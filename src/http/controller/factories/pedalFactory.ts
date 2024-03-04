import PgPedalModel from "../../model/postgres/PgPedalModel";
import PgUserModel from "../../model/postgres/PgUserModel";
import RedisCacheModel from "../../model/redis-cache/redisCacheModel";
import PedalService from "../../services/pedal/PedalService";

export default class PedalFactory {
  public constructor() {}

  public async exec() {
    const models = this.models();

    const pedalService = new PedalService(models.userModel, models.pedalModel);

    return pedalService;
  }

  public models() {
    const userModel = new PgUserModel();
    const pedalModel = new PgPedalModel();
    const cacheModel = new RedisCacheModel();

    return {
      userModel,
      pedalModel,
      cacheModel,
    };
  }
}
