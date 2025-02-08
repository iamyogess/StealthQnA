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
  const param = useParams<{ username: string }>();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("sign-in");
    } catch (error) {
      console.error("Error in verifying code!", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data?.message ?? "Error in verifying code!";
      console.log("axios error", errorMessage);
      toast({
        title: "Success failed!",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
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
                    {/* {isCheckingUsername && <Loader />}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username available :D"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p> */}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={verifying}>
            <div>
              {verifying ? (
                <>
                  <Loader /> Please wait...
                </>
              ) : (
                "Signup"
              )}
            </div>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyAccount;
