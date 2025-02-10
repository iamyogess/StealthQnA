"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";

const SendMessage = () => {
  const [isMessaging, setIsMessaging] = useState(false);

  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  //zod;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const sendMessageHandler = async (data: z.infer<typeof messageSchema>) => {
    setIsMessaging(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: param.username,
        content: data.content,
      });
      toast({
        title: "Message sent!",
        description: response.data.message || "Message sent successfully!",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending message!", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data?.message ?? "Error sending message!";
      console.log("axios error", errorMessage);
      toast({
        title: "Success failed!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMessaging(false);
    }
  };

  if (!param.username) {
    toast({ title: "Error", description: "Username is missing!" });
    return;
  }

  return (
    <>
      <p>Welcome, Send message to {param.username} anonymously</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(sendMessageHandler)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input placeholder="Your Message" {...field} />
                </FormControl>
                <FormDescription>
                  You can send message here anonymously!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
};

export default SendMessage;
