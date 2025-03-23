Here's a **complete README** for  **EdutechApp** including:  
- **API Endpoints**
- **Request Examples**
- **Responses (Success & Errors)**  

---

# **EdutechApp** 🎓

An educational platform that offers quizzes, leaderboards, and course enrollment with authentication.<br>
#  Backend App
## **Features** 🚀
- 🔐 User authentication (Signup/Login with JWT)
- 📚 Course enrollment & tracking
- 📝 Quiz system with score tracking
- 🏆 Leaderboard system
- ⚡ Secure API with Express.js & MongoDB

## **Tech Stack** 🛠️
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT & bcrypt.js
- **Caching:** Redis (Optional)
- **Deployment:** Render

## **Installation & Setup** ⚙️
### **1. Clone the Repository**
```sh
git clone https://github.com/Kavinraj2504/EdutechApp.git
cd EdutechApp
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Setup Environment Variables**
Create a `.env` file and add:
```
PORT=3000
MONGO_URI=your_mongodb_uri
ACCESS_JWT_SECRET=your_secret_key
JWT_SECRET=your_admin_secret_key
```

### **4. Run the Server**
```sh
npm start
```
or
```sh
node index.js
```

---

# **API Documentation** 📖

## **Authentication**
### **1️⃣ Signup User**
#### **Endpoint:**  
`POST /edutech/signup`

#### **Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456"
}
```

#### **Success Response:**
```json
{
  "accessToken": "jwt_token_here"
}
```

#### **Error Responses:**
- **400**: `{ "error": "Please fill valid information" }`
- **400**: `{ "error": "User already exists" }`
- **500**: `{ "error": "Error while creating user" }`

---

### **2️⃣ Login User**
#### **Endpoint:**  
`POST /edutech/login`

#### **Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

#### **Success Response:**
```json
{
  "accessToken": "jwt_token_here"
}
```

#### **Error Responses:**
- **400**: `{ "error": "User not found" }`
- **400**: `{ "error": "Password incorrect" }`
- **500**: `{ "error": "Server error" }`

---

## **User Operations**
### **3️⃣ Get Feed (Course Categories)**
#### **Endpoint:**  
`GET /edutech/feed`

#### **Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

#### **Success Response:**
```json
[
  { "_id": "Math" },
  { "_id": "Science" }
]
```

#### **Error Responses:**
- **401**: `{ "error": "Unauthorized" }`
- **500**: `{ "error": "Server error" }`

---

### **4️⃣ Get User Courses**
#### **Endpoint:**  
`GET /edutech/getUserCourses?page=0&limit=5`

#### **Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

#### **Success Response:**
```json
[
  {
    "_id": "quiz1_id",
    "name": "Algebra Basics",
    "description": "Learn algebra from scratch",
    "difficulty": "Easy",
    "category": "Math"
  }
]
```

#### **Error Responses:**
- **400**: `{ "error": "Invalid request" }`
- **500**: `{ "error": "Error while getting user courses" }`

---

### **5️⃣ Get Quiz Details**
#### **Endpoint:**  
`GET /edutech/getUserCourses/:id`

#### **Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

#### **Success Response:**
```json
{
  "_id": "quiz1_id",
  "name": "Algebra Basics",
  "description": "Learn algebra from scratch",
  "difficulty": "Easy",
  "category": "Math",
  "quizzes": [
    {
      "question": "What is 2+2?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "4"
    }
  ]
}
```

#### **Error Responses:**
- **400**: `{ "error": "Enter a valid ID" }`
- **500**: `{ "error": "Error while getting quiz details" }`

---

### **6️⃣ Enroll in a Course**
#### **Endpoint:**  
`PATCH /edutech/enrollCourse`

#### **Headers:**
```json
{
  "Authorization": "Bearer jwt_token_here"
}
```

#### **Request Body:**
```json
{
  "courseEnrolled": "Math"
}
```

#### **Success Response:**
```json
{ "message": "Enrolled successfully" }
```

#### **Error Responses:**
- **400**: `{ "error": "Enter a valid course name" }`
- **500**: `{ "error": "Error while updating user Course" }`

---

## **Admin Operations**
### **7️⃣ Create Quiz**
#### **Endpoint:**  
`POST /edutech/create-quiz`

#### **Headers:**
```json
{
  "Authorization": "Bearer admin_jwt_token_here"
}
```

#### **Request Body:**
```json
{
  "name": "Algebra Quiz",
  "description": "Basic algebra quiz",
  "difficulty": "Easy",
  "category": "Math",
  "quizes": [
    {
      "question": "What is 2+2?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "4"
    }
  ]
}
```

#### **Success Response:**
```json
{
  "_id": "quiz1_id",
  "name": "Algebra Quiz",
  "description": "Basic algebra quiz",
  "difficulty": "Easy",
  "category": "Math"
}
```

#### **Error Responses:**
- **400**: `{ "error": "Enter a valid info" }`
- **500**: `{ "error": "Error while creating quiz" }`

---

### **8️⃣ Delete a User**
#### **Endpoint:**  
`DELETE /edutech/toRemoveUser/:id`

#### **Headers:**
```json
{
  "Authorization": "Bearer admin_jwt_token_here"
}
```

#### **Success Response:**
```json
{ "message": "User deleted successfully" }
```

#### **Error Responses:**
- **500**: `{ "error": "Error while deleting user" }`

---

### **9️⃣ Delete a Quiz**
#### **Endpoint:**  
`DELETE /edutech/toRemoveQuiz/:id`

#### **Headers:**
```json
{
  "Authorization": "Bearer admin_jwt_token_here"
}
```

#### **Success Response:**
```json
{ "message": "Quiz deleted successfully" }
```

#### **Error Responses:**
- **500**: `{ "error": "Error while deleting quiz" }`

---

## **Deployment on Render** 🚀
1. Push your code to GitHub.
2. Go to **Render → New Web Service**.
3. Connect your repository.
4. Set the **Build Command** to:
   ```sh
   npm install
   ```
5. Set the **Start Command** to:
   ```sh
   node index.js
   ```
6. Deploy!

---


