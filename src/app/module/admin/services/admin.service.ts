// services/admin/admin.user.service.ts
import { prisma } from "../../../lib/prisma";
import { UserStatus, Role } from "../../../../generated/prisma/enums";
import bcrypt from "bcrypt";
import { IUserListResponse } from "../types";

const getUsers = async (
  page: number,
  limit: number,
  where: unknown
): Promise<IUserListResponse<unknown>> => {
  const skip = (page - 1) * limit;
  

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        image: true,
        address: true,
        city: true,
        district: true,
        division: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    }),

    prisma.user.count({ where }),
  ]);
  
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};



const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      address: true,
      city: true,
      district: true,
      division: true,
      postalCode: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,

      orders: {
        take: 10,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          items: {
            include: {
              seed: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },

      reviews: {
        take: 10,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          seed: {
            select: {
              id: true,
              name: true,
              name_en: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateUser = async (
  id: string,
  updateData: Record<string, any>
) => {
  const user = await prisma.user.update({
    where: { id },

    data: updateData,

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      address: true,
      updatedAt: true,
    },
  });

  return user;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.update({
    where: { id },

    data: {
      isDeleted: true,
      deletedAt: new Date(),
      status: "DELETED",
    },
  });

  return {
    id: user.id,
    deleted: true,
  };
};

const updateUserStatus = async (
  id: string,
  status: UserStatus
) => {
  const user = await prisma.user.update({
    where: { id },

    data: {
      status,
    },

    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });

  return user;
};


export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
  status?: UserStatus;
  address?: string;
  city?: string;
  district?: string;
  division?: string;
  postalCode?: string;

  latitude?: number | null;
  longitude?: number | null;

  emailVerified?: boolean;
  needPasswordChange?: boolean;
}) => {
  // 1. check email exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // 2. check phone exists
  if (payload.phone) {
    const existingPhone = await prisma.user.findUnique({
      where: {
        phone: payload.phone,
      },
    });

    if (existingPhone) {
      throw new Error("Phone already exists");
    }
  }

  // 3. hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    10
  );

  // 4. create user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,

      role: payload.role || Role.USER,

      phone: payload.phone || null,

      status:
        payload.status || UserStatus.ACTIVE,

      address: payload.address || null,
      city: payload.city || null,
      district: payload.district || null,
      division: payload.division || null,
      postalCode:
        payload.postalCode || null,

      latitude: payload.latitude || null,
      longitude:
        payload.longitude || null,

      emailVerified:
        payload.emailVerified ?? true,

      needPasswordChange:
        payload.needPasswordChange ?? true,
    },
  });

  // 5. create account
  await prisma.account.create({
    data: {
      accountId: crypto.randomUUID(),

      userId: user.id,

      providerId: payload.email,

      password: hashedPassword,
    },
  });

  // 6. return safe data
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    status: user.status,

    address: user.address,
    city: user.city,
    district: user.district,
    division: user.division,
    postalCode: user.postalCode,

    emailVerified: user.emailVerified,
    needPasswordChange:
      user.needPasswordChange,

    createdAt: user.createdAt,
  };
};


// ================= BACKEND UPDATE USER =================


export const updatedUser = async (
  id: string,
  payload: {
    name?: string;
    email?: string;
    role?: Role;
    phone?: string;
    status?: UserStatus;

    image?: string;

    address?: string;
    city?: string;
    district?: string;
    division?: string;
    postalCode?: string;

    latitude?: number | null;
    longitude?: number | null;

    emailVerified?: boolean;
    needPasswordChange?: boolean;
  }
) => {
  // 1. check user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // 2. email check
  if (
    payload.email &&
    payload.email !== existingUser.email
  ) {
    const emailExists =
      await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

    if (emailExists) {
      throw new Error(
        "Email already exists"
      );
    }
  }

  // 3. phone check
  if (
    payload.phone &&
    payload.phone !== existingUser.phone
  ) {
    const phoneExists =
      await prisma.user.findUnique({
        where: {
          phone: payload.phone,
        },
      });

    if (phoneExists) {
      throw new Error(
        "Phone already exists"
      );
    }
  }

  // 4. update user
  const updatedUser =
    await prisma.user.update({
      where: { id },

      data: {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone,
        status: payload.status,

        image: payload.image,

        address: payload.address,
        city: payload.city,
        district: payload.district,
        division: payload.division,
        postalCode: payload.postalCode,

        latitude: payload.latitude,
        longitude: payload.longitude,

        emailVerified:
          payload.emailVerified,

        needPasswordChange:
          payload.needPasswordChange,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,

        image: true,

        address: true,
        city: true,
        district: true,
        division: true,
        postalCode: true,

        emailVerified: true,
        needPasswordChange: true,

        createdAt: true,
        updatedAt: true,
      },
    });

  return updatedUser;
};


export const AdminUserService = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  createUser,
  updatedUser
};