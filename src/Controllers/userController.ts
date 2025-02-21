import { NextResponse } from "next/server";
import { InitalDataOfUser } from "../../types/models";
import { registerSchema } from "@/schemas/userSchema";
import { createUserService } from "@/Services/userService";

export async function createUserController(data: InitalDataOfUser) {
  try {
    const parsedData = registerSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }
    return await createUserService(parsedData.data);
  } catch (error) {
    throw error;
  }
}
