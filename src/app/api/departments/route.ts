import { fetchUsers } from "@/services/userService";
import { transformUserData } from "@/utils/transformUserData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await fetchUsers();
    const transformedData = transformUserData(data.users);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
