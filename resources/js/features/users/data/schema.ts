import { z } from 'zod';

const userRoleSchema = z.string();

const userSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string(),

    // These fields are not currently stored in the users table.
    phoneNumber: z.string().nullable(),
    status: z.string(),

    role: userRoleSchema,

    companyCount: z.number(),

    createdAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);