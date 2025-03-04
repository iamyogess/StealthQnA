import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { User as NextAuthUser } from "next-auth";
import mongoose from "mongoose";

interface AggregateUserResult {
  _id: mongoose.Types.ObjectId;
  messages: Array<{
    _id: string;
    content: string;
    createdAt: Date;
  }>;
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const authUser: NextAuthUser = session?.user as NextAuthUser;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(authUser._id);
  try {
    const users = await UserModel.aggregate<AggregateUserResult>([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    
    if (!users || users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }
    
    return Response.json(
      {
        success: true,
        message: users[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("user not found", error);
    return Response.json(
      {
        success: false,
        message: "User not found!",
      },
      { status: 404 }
    );
  }
}