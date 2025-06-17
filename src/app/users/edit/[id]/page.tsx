"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { UserEntity } from "@/entities/user/domain";
import styles from "./page.module.css";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState<UserEntity | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/users?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((user: UserEntity) => setForm(user))
      .catch((err) => {
        console.error("Ошибка при загрузке пользователя:", err);
        router.back();
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "age" || name === "salary" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      const res = await fetch(`/api/users?id=${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          age: form.age,
          department: form.department,
          salary: form.salary,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/");
    } catch (err) {
      console.error("Ошибка при обновлении пользователя:", err);
      alert("Не удалось сохранить");
    }
  };

  if (!form) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      <h1>Редактировать пользователя</h1>
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
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => router.back()}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
