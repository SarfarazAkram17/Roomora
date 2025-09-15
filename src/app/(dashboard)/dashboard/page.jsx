"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const Dashboard = () => {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (user?.role === "admin") {
    return <AdminDashboard />;
  } else if (user?.role === "user") {
    return <UserDashboard />;
  } else {
    return router.push("/forbidden");
  }
};

export default Dashboard;