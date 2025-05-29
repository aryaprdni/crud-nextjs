"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateUserInput, userSchema } from "../user-validation";
import { userFields } from "../../user-fields";

export default function CreateUserForm() {
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    setAlert(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");

      setAlert({ type: "success", message: "User created successfully!" });
      reset();
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err instanceof Error ? err.message : "An unknown error occurred.",
      });
    }
  };

  function getErrorMessage(name: string) {
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      return errors.address?.[key as keyof CreateUserInput["address"]]?.message;
    }
    return errors[name as keyof CreateUserInput]?.message;
  }

  return (
    <>
      {alert && (
        <Alert
          variant={alert.type === "error" ? "destructive" : "default"}
          className="mb-4"
        >
          <AlertTitle>
            {alert.type === "error" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-md mx-auto"
      >
        {userFields.map(({ name, label, type }) => (
          <div key={name} className="grid gap-1">
            <Label htmlFor={name}>{label}</Label>
            <Input
              id={name}
              type={type || "text"}
              {...register(name as keyof CreateUserInput)}
            />
            {getErrorMessage(name) && (
              <p className="text-red-600 text-sm mt-1">
                {getErrorMessage(name)}
              </p>
            )}
          </div>
        ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-400 hover:bg-gray-500 text-white w-full"
        >
          {isSubmitting ? "Submitting..." : "Create User"}
        </Button>
      </form>
    </>
  );
}
