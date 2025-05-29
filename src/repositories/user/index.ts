import { db } from "@/db";
import { addresses, users } from "@/db/schema";
import { User } from "@/domain/user/user-entity";
import { CreateUserInput, UpdateUserInput } from "@/domain/user/user-schema";
import { eq, like } from "drizzle-orm";

export async function createUserRepository(data: CreateUserInput) {
  const [createdUser] = await db
    .insert(users)
    .values({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate,
    })
    .returning();

  await db.insert(addresses).values({
    userId: createdUser.id,
    street: data.address.street,
    city: data.address.city,
    province: data.address.province,
    postalCode: data.address.postal_code,
  });

  return createdUser;
}

export async function getAllUsersRepository(
  page: number,
  limit: number,
  search: string
): Promise<{ users: User[]; total: number }> {
  const offset = (page - 1) * limit;

  const whereClause = search ? like(users.firstname, `%${search}%`) : undefined;

  const totalResult = await db
    .select()
    .from(users)
    .where(whereClause ? whereClause : undefined);

  const result = await db
    .select({
      id: users.id,
      firstname: users.firstname,
      lastname: users.lastname,
      birthdate: users.birthdate,
      address: {
        street: addresses.street,
        city: addresses.city,
        province: addresses.province,
        postal_code: addresses.postalCode,
      },
    })
    .from(users)
    .leftJoin(addresses, eq(addresses.userId, users.id))
    .where(whereClause ? whereClause : undefined)
    .limit(limit)
    .offset(offset);

  return { users: result, total: totalResult.length };
}

export async function updateUserRepository(id: number, data: UpdateUserInput) {
  await db
    .update(users)
    .set({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: data.birthdate,
    })
    .where(eq(users.id, id));

  await db
    .update(addresses)
    .set({
      street: data.address.street,
      city: data.address.city,
      province: data.address.province,
      postalCode: data.address.postal_code,
    })
    .where(eq(addresses.userId, id));

  return { id, ...data };
}

export async function getUserByIdRepository(id: number): Promise<User | null> {
  const result = await db
    .select({
      id: users.id,
      firstname: users.firstname,
      lastname: users.lastname,
      birthdate: users.birthdate,
      address_id: addresses.id,
      street: addresses.street,
      city: addresses.city,
      province: addresses.province,
      postalCode: addresses.postalCode,
    })
    .from(users)
    .leftJoin(addresses, eq(addresses.userId, users.id))
    .where(eq(users.id, id))
    .limit(1);

  const row = result[0];
  if (!row) return null;

  return {
    id: row.id,
    firstname: row.firstname,
    lastname: row.lastname,
    birthdate: row.birthdate,
    address: row.address_id
      ? {
          street: row.street ?? "",
          city: row.city ?? "",
          province: row.province ?? "",
          postal_code: row.postalCode ?? "",
        }
      : null,
  };
}

export async function deleteUserByIdRepository(id: number): Promise<boolean> {
  const deleted = await db.delete(users).where(eq(users.id, id)).returning();
  return deleted.length > 0;
}
