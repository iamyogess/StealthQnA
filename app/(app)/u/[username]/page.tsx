"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

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
import { Card, CardContent } from "@/components/ui/card";

interface ApiResponse {
  success: boolean;
  questions?: string[];
  raw?: string;
  message?: string;
  error?: string;
}

const SendMessage = () => {
  const [isMessaging, setIsMessaging] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const param = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  // Fetch suggested messages
  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsFetchingSuggestions(true);
      try {
        const response = await axios.get<ApiResponse>("/api/suggest-messages");
        if (response.data.success && response.data.raw) {
          // Split the raw string by "||" and trim each question
          const parsedQuestions = response.data.raw
            .split("||")
            .map(q => q.trim())
            .filter(q => q.length > 0); // Remove any empty strings
          setSuggestedMessages(parsedQuestions);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data?.error || "Failed to fetch suggestions";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsFetchingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [toast]);

  // Send message handler
  const sendMessageHandler = async (data: { content: string }) => {
    if (!param.username) {
      toast({ title: "Error", description: "Username is missing!" });
      return;
    }

    setIsMessaging(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: param.username,
        content: data.content,
      });
      
      toast({
        title: "Success!",
        description: response.data.message || "Message sent successfully!",
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message || "Failed to send message";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsMessaging(false);
    }
  };

  const useSuggestedMessage = (message: string) => {
    form.setValue("content", message);
  };

  if (!param.username) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Send Anonymous Message</h1>
      <p className="text-gray-600">
        Send a message to {param.username} anonymously
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendMessageHandler)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Message</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Type your message here..." 
                    {...field}
                    className="h-24"
                  />
                </FormControl>
                <FormDescription>
                  Your identity will remain anonymous
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isMessaging}
            className="w-full"
          >
            {isMessaging ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>

      {suggestedMessages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Suggested Questions</h2>
          <div className="space-y-3">
            {suggestedMessages.map((message, index) => (
              <Card key={index} className="hover:bg-gray-50 transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">{message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => useSuggestedMessage(message)}
                  >
                    Use This
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isFetchingSuggestions && (
        <p className="text-center text-gray-500">Loading suggestions...</p>
      )}
    </div>
  );
};

export default SendMessage;