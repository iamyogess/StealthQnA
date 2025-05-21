"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

type MessageProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast({
        title: response.data.message || "Message deleted successfully",
      });
      onMessageDelete(message._id);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format the date
  const formattedDate = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : "Unknown date";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardDescription className="text-sm text-gray-500">
            Received {formattedDate}
          </CardDescription>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete message</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
