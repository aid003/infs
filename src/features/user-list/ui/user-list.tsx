"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./user-list.module.css";
import type { UserEntity } from "@/entities/user/domain";

type Props = {
  users: UserEntity[];
};

export default function UserList({ users: initialUsers }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<UserEntity[]>(initialUsers);
  const [searchEmail, setSearchEmail] = useState("");
  const [editingUser, setEditingUser] = useState<UserEntity | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserEntity | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const openCreate = () => setCreating(true);
  const openEdit = (user: UserEntity) => setEditingUser(user);
  const openDelete = (user: UserEntity) => setDeletingUser(user);
  const closeModals = () => {
    setCreating(false);
    setEditingUser(null);
    setDeletingUser(null);
  };

  const handleSearch = () => {
    const found = initialUsers.find((u) => u.email === searchEmail.trim());
    if (found) setUsers([found]);
    else alert("Пользователь с таким email не найден");
  };

  const resetSearch = () => {
    setUsers(initialUsers);
    setSearchEmail("");
  };

  const handleCreate = async (data: Omit<UserEntity, "id">) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
      const newUser: UserEntity = await res.json();
      setUsers([newUser, ...users]);
      closeModals();
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      alert("Ошибка при создании");
    }
  };

  const handleUpdate = async (updated: UserEntity) => {
    try {
      const res = await fetch(`/api/users?id=${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Update failed");
      const saved: UserEntity = await res.json();
      setUsers(users.map((u) => (u.id === saved.id ? saved : u)));
      closeModals();
    } catch (error) {
      console.error("Ошибка при обновлении пользователя:", error);
      alert("Ошибка при обновлении");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/users?id=${deletingUser.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      closeModals();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Искать по email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Поиск
        </button>
        <button onClick={resetSearch} className={styles.resetButton}>
          Сброс
        </button>
        <button className={styles.create} onClick={openCreate}>
          Создать
        </button>
      </div>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Возраст</th>
            <th>Отдел</th>
            <th>Зарплата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.department}</td>
              <td>{user.salary}</td>
              <td>
                {activeId === user.id ? (
                  <div className={styles.actions}>
                    <button
                      className={styles.edit}
                      onClick={() => openEdit(user)}
                    >
                      Изменить
                    </button>
                    <button
                      className={styles.dismiss}
                      onClick={() => openDelete(user)}
                    >
                      Уволить
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.activate}
                    onClick={() => setActiveId(user.id)}
                  >
                    Внести изменения
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {creating && (
        <CreateModal
          onCreate={handleCreate}
          onClose={closeModals}
          router={router}
        />
      )}
      {editingUser && (
        <EditModal
          user={editingUser}
          onSubmit={handleUpdate}
          onClose={closeModals}
          router={router}
        />
      )}
      {deletingUser && (
        <ConfirmModal
          user={deletingUser}
          onConfirm={handleDelete}
          onClose={closeModals}
        />
      )}
    </div>
  );
}

function CreateModal({
  onCreate,
  onClose,
  router,
}: {
  onCreate: (data: Omit<UserEntity, "id">) => void;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [form, setForm] = useState<Omit<UserEntity, "id">>({
    name: "",
    email: "",
    age: 0,
    department: "",
    salary: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(
      (prev) =>
        ({
          ...prev,
          [name]: name === "age" || name === "salary" ? Number(value) : value,
        } as Omit<UserEntity, "id">),
    );
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Создать пользователя</h2>
          <button
            className={styles.linkButton}
            onClick={() => router.push("/users/create")}
          >
            Перейти на страницу
          </button>
        </div>
        <form onSubmit={onSave} className={styles.form}>
          <label>
            Имя
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Возраст
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Отдел
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </label>
          <label>
            Зарплата
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
            />
          </label>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.edit}>
              Создать
            </button>
            <button type="button" className={styles.dismiss} onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditModal({
  user,
  onSubmit,
  onClose,
  router,
}: {
  user: UserEntity;
  onSubmit: (u: UserEntity) => void;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [form, setForm] = useState<UserEntity>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(
      (prev) =>
        ({
          ...prev,
          [name]: name === "age" || name === "salary" ? Number(value) : value,
        } as UserEntity),
    );
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Редактировать пользователя</h2>
          <button
            className={styles.linkButton}
            onClick={() => router.push(`/users/edit/${user.id}`)}
          >
            Перейти на страницу
          </button>
        </div>
        <form onSubmit={onSave} className={styles.form}>
          <label>
            Имя
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Возраст
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
            />
          </label>
          <label>
            Отдел
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </label>
          <label>
            Зарплата
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
            />
          </label>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.edit}>
              Сохранить
            </button>
            <button type="button" className={styles.dismiss} onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({
  user,
  onConfirm,
  onClose,
}: {
  user: UserEntity;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>
          Вы уверены, что хотите уволить <strong>{user.name}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.dismiss} onClick={onConfirm}>
            Да, уволить
          </button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}
