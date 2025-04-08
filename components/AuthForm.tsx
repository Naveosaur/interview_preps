"use client";
import React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "./ui/button";
import { Form } from "./ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "register" ? z.string().min(3, "Name is required") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  //   Define Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  //   Submit Form
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      if (type === "register") {
        // Register user
        router.push("/");
        toast.success("User registered successfully");
      } else {
        // Login user
        router.push("/");
        toast.success("User logged in successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error(`there was an error: ${err}`);
    }
  };

  const isSignIn = type === "login";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={39} />
          <h2 className="text-primary-100">Interview Preps</h2>
        </div>

        <h3 className="text-neutral-300">Practice interview</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField control={form.control} name="name" label="Name" placeholder="Your Name" />
            )}

            <FormField control={form.control} name="email" label="Email" placeholder="Your Email" />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
