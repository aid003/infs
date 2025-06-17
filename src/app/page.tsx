import React from "react";
import { getUsers } from "@/entities/user/server";
import styles from "./page.module.css";
import { UserList } from "@/features/server";

export default async function Home() {
  const users = await getUsers();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Админ панель оранжевого YouTube</h1>
      <UserList users={users} />
    </div>
  );
}
