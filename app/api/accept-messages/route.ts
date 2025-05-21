import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { dbConnect } from "@/lib/dbConnect"
import { UserModel } from "@/model/User"
import type { User } from "next-auth"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated!",
        },
        { status: 401 },
      )
    }

    if (!user._id) {
      return Response.json(
        {
          success: false,
          message: "Invalid user ID!",
        },
        { status: 400 },
      )
    }

    const body = await request.json()

    // Check if acceptMessages exists and is a boolean
    if (typeof body.acceptMessages !== "boolean") {
      return Response.json(
        {
          success: false,
          message: "Invalid request: acceptMessages must be a boolean",
        },
        { status: 400 },
      )
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        isAcceptingMessage: body.acceptMessages,
      },
      { new: true },
    )

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        message: body.acceptMessages ? "You are now accepting messages" : "You are no longer accepting messages",
        isAcceptingMessage: updatedUser.isAcceptingMessage,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating message acceptance status:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to update message acceptance status",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated!",
        },
        { status: 401 },
      )
    }

    if (!user._id) {
      return Response.json(
        {
          success: false,
          message: "Invalid user ID!",
        },
        { status: 400 },
      )
    }

    const foundUser = await UserModel.findById(user._id)

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error getting message acceptance status:", error)
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 },
    )
  }
}
