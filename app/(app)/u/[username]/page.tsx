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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, MessageSquare, LightbulbIcon, Lock } from "lucide-react";

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
  const username = param?.username;

  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsFetchingSuggestions(true);
      try {
        const response = await axios.get<ApiResponse>("/api/suggest-messages");
        if (response.data.success && response.data.raw) {
          const parsedQuestions = response.data.raw
            .split("||")
            .map(q => q.trim())
            .filter(q => q.length > 0);
          setSuggestedMessages(parsedQuestions);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data?.error || "Failed to fetch suggestions",
          variant: "destructive",
        });
      } finally {
        setIsFetchingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [toast]);

  const sendMessageHandler = async (data: { content: string }) => {
    if (!username) {
      toast({ title: "Error", description: "Username is missing!" });
      return;
    }

    setIsMessaging(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: username,
        content: data.content,
      });
      
      toast({
        title: "Success!",
        description: response.data.message || "Message sent successfully!",
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsMessaging(false);
    }
  };

  const handleSuggestedMessage = (message: string) => {
    form.setValue("content", message);
  };

  if (!username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 mt-10 lg:mt-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              <MessageSquare className="w-6 h-6" />
              Send Anonymous Message
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              to <span className="font-semibold text-purple-600 dark:text-purple-400">@{username}</span>
            </p>
          </CardHeader>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(sendMessageHandler)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Type your message here..." 
                          {...field}
                          className="min-h-32 resize-none focus:ring-2 focus:ring-purple-500"
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-gray-500" />
                        Your identity will remain anonymous
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isMessaging}
                  className="text-white w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                >
                  {isMessaging ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {suggestedMessages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LightbulbIcon className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Suggested Questions</h2>
            </div>
            <div className="grid gap-3">
              {suggestedMessages.map((message, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4 flex justify-between items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestedMessage(message)}
                      className="shrink-0 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20"
                    >
                      Use This
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMessage;