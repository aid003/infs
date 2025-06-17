"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserEntity } from "@/entities/user/domain";
import styles from "./page.module.css";

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<UserEntity, "id">>({
    name: "",
    email: "",
    age: 0,
    department: "",
    salary: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "age" || name === "salary" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Create failed");
      router.push("/"); // вернуться на список
    } catch (err) {
      console.error("Ошибка при создании пользователя:", err);
      alert("Не удалось создать");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Создать пользователя</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Имя
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Возраст
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Отдел
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Зарплата
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            required
          />
        </label>
        <div className={styles.actions}>
          <button type="submit">Создать</button>
          <button type="button" onClick={() => router.back()}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
