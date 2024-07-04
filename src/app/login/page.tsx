"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { loginSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/navbar";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material";
import { useAuthenticate } from "@/lib/hooks/useAuthenticate";
import { authenticate } from "@/lib/actions/authenticate";

const CssTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    padding: "10px 15px",
    fontSize: "16px",
  },
});

const Login = () => {
  useAuthenticate();

  const [isWrongCredentials, setIsWrongCredentials] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = useCallback(async () => {
    if (!loginForm.getValues("password") || !loginForm.getValues("username")) {
      return;
    }

    setLoginLoading(true);

    const username = loginForm.getValues("username");
    const password = loginForm.getValues("password");

    try {
      const res = await authenticate(username, password);

      if (res.authenticated && res.username) {
        router.push("/");

        window.sessionStorage.setItem("username", res.username);
        setIsWrongCredentials(false);
      } else {
        setIsWrongCredentials(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoginLoading(false);
    }
  }, [router, loginForm]);

  return (
    <main className="h-screen w-full bg-[#F5F5F5]">
      <Header />
      <hr />
      <div className="mx-auto mt-[4rem] flex flex-col justify-center bg-white h-[62vh] w-[85vw] min-[480px]:w-[26rem] px-7 min-[480px]:px-14">
        <h1 className="text-xl font-bold text-center mb-7">Log In</h1>
        {isWrongCredentials && (
          <p className="bg-[#F1F1F1] rounded-md mb-3 p-2 text-center ml-auto w-2/3 text-[10px]">
            The credentials entered do not match
          </p>
        )}
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CssTextField
                      error={isWrongCredentials}
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      size="small"
                      fullWidth
                      variant="outlined"
                      label={
                        isWrongCredentials
                          ? "Enter a valid Username"
                          : "Username"
                      }
                      disabled={loginLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="my-5">
                  <FormControl>
                    <CssTextField
                      error={isWrongCredentials}
                      value={field.value}
                      onChange={field.onChange}
                      type="password"
                      size="small"
                      fullWidth
                      label={
                        isWrongCredentials
                          ? "Enter a valid Password"
                          : "Password"
                      }
                      variant="outlined"
                      disabled={loginLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              disabled={loginLoading}
              onClick={onSubmit}
              className="w-full bg-[#182CE3] hover:bg-[#0F1BCC] text-white"
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default Login;
