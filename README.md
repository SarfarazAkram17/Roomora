# Roomora

## Project Description

**Roomora** is a full-stack hotel booking platform designed to make booking and managing hotel rooms seamless for users. Users can browse hotels, check room availability, book rooms, and manage their bookings, while admins can manage hotels, monitor bookings, and view detailed statistics about users, hotels, and earnings.

This project demonstrates a complete modern web application built with **Next.js**, **React**, **MongoDB**, and **JWT authentication**, to provide dynamic interactions for both users and admins.

---

## Tech Stack

- **Frontend:**

  - Next.js
  - React
  - Tailwind CSS
  - Material-UI (MUI)
  - Ant Design (UI Components)
  - React Query (`@tanstack/react-query`) for data fetching and caching
  - Recharts for dynamic charts and statistics
  - React Icons (`react-icons`, `lucide-react`) for icons
  - React Select & React Datepicker for forms
  - Framer Motion & Lottie React for animations
  - React Toastify & SweetAlert2 for notifications and confirmations
  - Cloudinary - for image hosting

- **Backend:**

  - Next.js API Routes
  - MongoDB
  - JWT authentication (`jsonwebtoken`)
  - Bcrypt for password hashing

- **Other Tools:**
  - Axios for API requests
  - Tailwind CSS for styling

---

## Features

### User Features

- **User Authentication:** Sign up, login, and logout with JWT-based HttpOnly cookies.
- **Profile Management:** View and update profile details including name, profile picture.
- **Hotel Browsing:** Browse hotels with photos, amenities, pricing, and descriptions.
- **Room Booking:** Book available rooms for specific dates.
- **Booking Management:** View current and past bookings, cancel unpaid bookings.
- **Notifications:** Toast and modal notifications for successful actions, errors.

### Admin Features

- **Hotel Management:** Add, update, and delete hotel listings. Manage total rooms, pricing, amenities, and images.
- **Booking Management:** View all bookings, filter by status, and update booking statuses.
- **Statistics Dashboard:** Monitor total users, hotels, bookings, and earnings. View monthly booking and payment trends using charts.
- **Role-Based Access:** Admin routes are protected; users cannot access admin-only pages.

---

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/SarfarazAkram17/Roomora.git <br />
cd roomora