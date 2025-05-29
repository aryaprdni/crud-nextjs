import {
  CreateUserInput,
  CreateUserSchema,
  UpdateUserInput,
  UpdateUserSchema,
} from "@/domain/user/user-schema";
import { ApiError } from "@/lib/api-error";
import {
  createUserRepository,
  deleteUserByIdRepository,
  getAllUsersRepository,
  getUserByIdRepository,
  updateUserRepository,
} from "@/repositories/user";

export async function createUserUseCase(data: CreateUserInput) {
  const parsed = CreateUserSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Validation Error", 400, parsed.error);
  }

  const user: CreateUserInput = parsed.data;
  const createdUser = await createUserRepository(user);
  return createdUser;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
  } | null;
}

export async function getAllUsersUseCase(
  page: number,
  search: string
): Promise<{ users: User[]; total: number }> {
  const limit = 5;

  const { users: rawUsers, total } = await getAllUsersRepository(
    page,
    limit,
    search
  );

  return { users: rawUsers, total };
}

export async function updateUserUseCase(id: number, data: unknown) {
  const parsed = UpdateUserSchema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("Validation Error", 400, parsed.error);
  }

  const userData: UpdateUserInput = parsed.data;
  const updatedUser = await updateUserRepository(id, userData);

  return updatedUser;
}

export async function getUserByIdUseCase(id: number): Promise<User | null> {
  return await getUserByIdRepository(id);
}

export async function deleteUserByIdUseCase(id: number): Promise<boolean> {
  return deleteUserByIdRepository(id);
}
