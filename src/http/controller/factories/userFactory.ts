import PgUserModel from "../../model/postgres/PgUserModel";
import UserService from "../../services/user/userService";

export class UserFactory {
  public async exec() {
    const models = this.model();

    const userService = new UserService(models.userModel);

    return {
      userService,
    };
  }

  private model() {
    const userModel = new PgUserModel();

    return {
      userModel,
    };
  }
}
