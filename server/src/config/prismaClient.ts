import { PrismaClient, Prisma } from "@prisma/client";
import { AppError } from "middlewares/errorHandler.js";

const prisma = new PrismaClient();

// Prisma 및 일반 오류 처리 메서드
const handlePrismaError = (err: unknown): never => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        throw new AppError("Data already exists", 409);
      case "P2025":
        throw new AppError("Data not found", 404);
      default:
        throw new AppError("Database error occurred", 500);
    }
  }
  // PrismaClientInitializationError 처리 (DB 연결 오류)
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    throw new AppError("Failed to connect to the database", 500);
  }
  // PrismaClientValidationError 처리 (잘못된 요청 데이터)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    throw new AppError("Invalid request", 400);
  } else {
    throw new AppError("Database error occurred", 500);
  }
};

export { prisma, handlePrismaError };
