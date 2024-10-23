import { NextResponse } from "next/server";
import { cookies } from "next/headers";

//This method is used to logout the user by deleting the token from the cookies
// In the logout mutation we will use this api call to delete the cookies
export async function POST() {
  try {
    cookies().delete("token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 },
    );
  }
}
