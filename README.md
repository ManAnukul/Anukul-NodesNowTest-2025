# 📝 Task OF Me Web Application
Task OF Me เป็น Web Application สำหรับจัดการงาน (Task Management) ที่พัฒนาด้วย **Vite.js** และ **React.js** บนฝั่ง Frontend และ **Nest.js** บนฝั่ง Backend พร้อมระบบ Authentication ด้วย **JWT** เก็บไว้ใน **Cookie** และฐานข้อมูล **MySQL** มีการ Styling ด้วย **Tailwind CSS** และเขียน Test ด้วย **Vitest** และ **Cypress** สำหรับ Automated Testing

---

## คุณสมบัติหลัก

- **จัดการงาน (CRUD Tasks)** : สร้าง, อ่าน, แก้ไข และลบงาน
- **ระบบสมาชิกและการยืนยันตัวตน (Authentication)**

---

## Technologies Used

- **Frontend**: Vite.js, React.js, Tailwind CSS
- **Backend**: Nest.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Testing**: Vitest
- **End-to-End Testing**: Cypress

---

## โครงสร้างโปรเจกต์

```
|- backend/
|   |- src/
|      |- auth/  
|      |- database/ 
|      |- task/ 
|      |- user/
|
|- frontend/
|   |- cypress/
|      |- downloads/
|      |- e2e/
|         |- Login/
|         |- Register/
|         |- Task/
|      |- fixtures/
|      |- support/
|   |- src/
|      |- component/
|         |- Login/
|         |- Modals/
|         |- Navbar/
|         |- Register/
|         |- taskCard/
|         |- taskDetail/
|         |- taskList/
|      |- Page/
|         |- LoginPage/
|         |- RegisterPage/
|         |- TasksManagementPage/
|      |- lib/
|         |- axios.ts
|      |- Router/
|         |- Router.tsx
|      |- Types/
|         |- AddTaskModalProps.ts
|         |- ConfirmDeleteModalProps.ts
|         |- EditTaskModalProps.ts
|         |- TaskCardProps.ts
|         |- TaskDetailModalProps.ts
|         |- TaskType.ts
|-.env
```

---

## การติดตั้งและเริ่มต้นใช้งาน

### ความต้องการเบื้องต้น

- Node.js (v16.x หรือสูงกว่า)
- npm (v8.x หรือสูงกว่า)
- MySQL (v8.x หรือสูงกว่า)
- Git
- Docker

### ขั้นตอนการติดตั้ง

1. **Clone Repository**

   ```bash
   git clone https://github.com/ManAnukul/Anukul-NodesNowTest-2025.git
   cd Anukul-NodesNowTest-2025
   ```

2. **ตั้งค่า Environment Variables**

   **สำหรับ Backend** (สร้างไฟล์ `.env` ในโฟลเดอร์ `backend`)

   ```env
   DATABASE_HOST=db
   DATABASE_PORT=3306
   DATABASE_NAME=taskofme
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   ```

   **สำหรับ Frontend** (สร้างไฟล์ `.env` ในโฟลเดอร์ `frontend`)

   ```env
   VITE_END_POINT="http://localhost:3000"
   ```

3. **ติดตั้งและเริ่มต้น Backend**

   ```bash
   cd backend
   npm install
   docker-compose up --build -d
   ```

   - Backend จะทำงานที่: `http://localhost:3000`

4. **ติดตั้งและเริ่มต้น Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Frontend จะทำงานที่: `http://localhost:5173`

---

## 🧪 การทดสอบ

### Unit Testing (Frontend)

ใช้ **Vitest** ในการรันทดสอบ Unit Test:

```bash
cd frontend
npm run test
# หรือ
npm run coverage
```

### End-to-End Testing (Frontend)

ใช้ **Cypress** ในการรันทดสอบ End-to-End Test:

1. เปิด Cypress UI (Interactive mode)

   ```bash
   cd frontend
   npx cypress open
   ```

   - เลือกไฟล์ทดสอบที่อยู่ใน `/cypress/e2e/` เพื่อรันผ่านหน้า UI ได้
---

