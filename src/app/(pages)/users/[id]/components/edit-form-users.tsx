"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "../../types";

export default function EditUserForm() {
  const { id } = useParams();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      firstname: "",
      lastname: "",
      birthdate: "",
      address: {
        street: "",
        city: "",
        province: "",
        postal_code: "",
      },
    },
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data: User) => {
        reset(data);
      });
  }, [id, reset]);

  const onSubmit = async (data: User) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/users");
      } else {
        const errorResponse = await res.json();

        if (errorResponse?.details?.issues) {
          interface Issue {
            path: string[];
            message: string;
          }
          const messages = errorResponse.details.issues
            .map(
              (issue: Issue) => `• ${issue.path.join(".")}: ${issue.message}`
            )
            .join("\n");

          setErrorMessage(`Gagal memperbarui data:\n${messages}`);
        } else {
          setErrorMessage("Gagal memperbarui data. Silakan coba lagi.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Update User</h1>

      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            {...register("firstname", { required: "First name wajib diisi" })}
            placeholder="First Name"
          />
          {errors.firstname && (
            <p className="text-red-600 text-sm mt-1">
              {errors.firstname.message}
            </p>
          )}
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            {...register("lastname", { required: "Last name wajib diisi" })}
            placeholder="Last Name"
          />
          {errors.lastname && (
            <p className="text-red-600 text-sm mt-1">
              {errors.lastname.message}
            </p>
          )}
        </div>

        <div>
          <Label>Birthdate</Label>
          <Input
            type="date"
            {...register("birthdate", {
              required: "Birthdate wajib diisi",
            })}
          />
          {errors.birthdate && (
            <p className="text-red-600 text-sm mt-1">
              {errors.birthdate.message}
            </p>
          )}
        </div>

        <h2 className="font-semibold mt-4 mb-2">Address</h2>

        <div>
          <Label>Street</Label>
          <Input
            {...register("address.street", {
              required: "Street wajib diisi",
            })}
            placeholder="Street"
          />
          {errors.address?.street && (
            <p className="text-red-600 text-sm mt-1">
              {errors.address.street.message}
            </p>
          )}
        </div>

        <div>
          <Label>City</Label>
          <Input
            {...register("address.city", { required: "City wajib diisi" })}
            placeholder="City"
          />
          {errors.address?.city && (
            <p className="text-red-600 text-sm mt-1">
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div>
          <Label>Province</Label>
          <Input
            {...register("address.province", {
              required: "Province wajib diisi",
            })}
            placeholder="Province"
          />
          {errors.address?.province && (
            <p className="text-red-600 text-sm mt-1">
              {errors.address.province.message}
            </p>
          )}
        </div>

        <div>
          <Label>Postal Code</Label>
          <Input
            {...register("address.postal_code", {
              required: "Postal Code wajib diisi",
            })}
            placeholder="Postal Code"
          />
          {errors.address?.postal_code && (
            <p className="text-red-600 text-sm mt-1">
              {errors.address.postal_code.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-4">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
