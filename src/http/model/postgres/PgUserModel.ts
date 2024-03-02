import { IUser, UserServiceRegisterRequest } from "../../../@types/user.types";
import pool from "../../lib/pg";
import UserRepository from "../../repositories/userRepository";

export default class PgUserModel implements UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tb_users WHERE email = $1",
      [email]
    );

    if (!rows[0]) return null;

    const userModel = rows[0];

    return {
      id: userModel.id,
      email: userModel.email,
      fullName: userModel.full_name,
      password: userModel.password,
      createdAt: userModel.created_at,
      updatedAt: userModel.updated_at,
    };
  }

  async findById(id: string): Promise<IUser | null> {
    const { rows } = await pool.query("SELECT * FROM tb_users WHERE id = $1", [
      id,
    ]);

    if (!rows[0]) return null;

    const userModel = rows[0];

    return {
      id: userModel.id,
      email: userModel.email,
      fullName: userModel.full_name,
      password: userModel.password,
      createdAt: userModel.created_at,
      updatedAt: userModel.updated_at,
    };
  }

  async save({
    email,
    fullName,
    password,
  }: UserServiceRegisterRequest): Promise<IUser> {
    const { rows } = await pool.query(
      "INSERT INTO tb_users (email, full_name, password) VALUES ($1, $2, $3) RETURNING *",
      [email, fullName, password]
    );

    const userModel = rows[0];

    return {
      id: userModel.id,
      email: userModel.email,
      fullName: userModel.full_name,
      password: userModel.password,
      createdAt: userModel.created_at,
      updatedAt: userModel.updated_at,
    };
  }
}
