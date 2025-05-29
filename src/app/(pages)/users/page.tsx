"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "./types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      const query = new URLSearchParams();
      query.append("page", String(page));
      if (search.trim() !== "") {
        query.append("search", search.trim());
      }

      const res = await fetch(`/api/users?${query.toString()}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    }

    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User List</h1>

      <input
        type="text"
        placeholder="Search by firstname..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 mb-4 w-full rounded"
      />

      <div className="grid gap-4">
        {users.length === 0 && <p>No users found.</p>}

        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-sm text-gray-600">DOB: {user.birthdate}</p>
                <p className="text-sm text-gray-600">
                  Address: {user.address?.street}, {user.address?.city},{" "}
                  {user.address?.province}, {user.address?.postal_code}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/users/${user.id}`)}
                >
                  Update
                </Button>
                <Button variant="outline" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center items-center gap-2">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
