"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (!username) {
      toast({
        title: "Error",
        description: "Username is missing",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error in verifying code!", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ?? "Error in verifying code!";
      console.log("axios error", errorMessage);
      toast({
        title: "Verification failed!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-screen-sm w-full mx-auto mt-24">
      <h1 className="text-lg font-bold lg:text-xl my-4">Enter your 6 digit code here</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Code here" {...field} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={verifying}>
            {verifying ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin" /> Please wait...
              </div>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyAccount;