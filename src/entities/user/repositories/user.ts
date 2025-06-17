import { prisma } from "@/shared/lib/db";
import { UserEntity } from "../domain";
import { Prisma } from "@/generated/prisma";

async function userList(where?: Prisma.UserWhereInput): Promise<UserEntity[]> {
  return prisma.user.findMany({ where });
}

async function userById(id: string): Promise<UserEntity | null> {
  return prisma.user.findUnique({ where: { id } });
}

async function createUser(data: Prisma.UserCreateInput): Promise<UserEntity> {
  return prisma.user.create({ data });
}

async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<UserEntity> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

async function deleteUser(id: string): Promise<UserEntity> {
  return prisma.user.delete({ where: { id } });
}

export const userRepository = {
  userList,
  userById,
  createUser,
  updateUser,
  deleteUser,
};
