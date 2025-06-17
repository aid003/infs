import { UserEntity } from "../domain";
import { userRepository } from "../repositories/user";
import { Prisma } from "@/generated/prisma";

export async function getUsers(): Promise<UserEntity[]> {
  return userRepository.userList();
}

export async function getUserById(id: string): Promise<UserEntity | null> {
  return userRepository.userById(id);
}

export async function createUser(
  data: Prisma.UserCreateInput,
): Promise<UserEntity> {
  return userRepository.createUser(data);
}

export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<UserEntity> {
  return userRepository.updateUser(id, data);
}

export async function deleteUser(id: string): Promise<UserEntity> {
  return userRepository.deleteUser(id);
}
