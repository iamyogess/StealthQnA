import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { dbConnect } from "@/lib/dbConnect"
import { UserModel } from "@/model/User"
import type { User as NextAuthUser } from "next-auth"
import mongoose from "mongoose"

interface AggregateUserResult {
  _id: mongoose.Types.ObjectId
  messages: Array<{
    _id: string
    content: string
    createdAt: Date
  }>
}

export async function GET() {
  try {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const authUser = session?.user as NextAuthUser

    if (!session || !authUser) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated!",
        },
        { status: 401 },
      )
    }

    if (!authUser._id) {
      return Response.json(
        {
          success: false,
          message: "Invalid user ID!",
        },
        { status: 400 },
      )
    }

    const userId = new mongoose.Types.ObjectId(authUser._id)

    const users = await UserModel.aggregate<AggregateUserResult>([
      { $match: { _id: userId } }, // Changed from 'id' to '_id' to match MongoDB document field
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ])

    if (!users || users.length === 0) {
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
        messages: users[0].messages,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching user messages:", error)
    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages!",
      },
      { status: 500 },
    )
  }
}
