#Online Voting App – Backend API

A secure and scalable backend system for an Online Voting Application built using Node.js, Express.js, MongoDB, and JWT Authentication.
The system supports role-based access for Admin and Voter (User) with secure vote casting and real-time vote tracking.

🚀 Features => 
🔐 JWT-based Authentication (Access + Refresh Token)
👤 Role-Based Access Control (Admin / Voter)
🗳️ Secure One-Person-One-Vote system
📊 Live Vote Counting with Percentage Calculation
🏆 Automatic Winner Detection
🔒 Password Hashing using bcrypt
🍪 HTTP-only Cookie based authentication
📈 Real-time vote status API for Admin

📂 API Modules
👨‍💼 Admin APIs
🔑 Authentication

POST /api/admin/register
POST /api/admin/login
GET /api/admin/profile
POST /api/admin/logout

🗳️ Election Monitoring => 
GET /api/admin/live-status → Get real-time vote count & percentage
GET /api/admin/winner → Get current leading candidate
GET /api/admin/candidate-votes/:candidateId → Get vote details (User _id only for privacy)

🏛️ Candidate APIs (Admin Controlled) => 
POST /api/admin/candidate/register
PUT /api/admin/candidate/update/:candidateId
DELETE /api/admin/candidate/delete/:candidateId

Features: => 
Unique Candidate ID
Auto voteCount increment
Vote tracking with timestamp

👤 User (Voter) APIs => 
🔐 Authentication => 
POST /api/user/register
POST /api/user/login
GET /api/user/profile
PUT /api/user/change-password
POST /api/user/logout

🗳️ Voting => 
POST /api/user/vote/:candidateId
Ensures one user can vote only once

Updates: => 
User isVoted
User votedCandidate
Candidate voteCount
Candidate votes[]

📋 Candidate Viewing => 
GET /api/user/candidates → Get all candidates
GET /api/user/candidates/:candidateId → Get single candidate details

🔒 Security Measures => 
Password hashing using bcrypt
JWT Access + Refresh Token mechanism
HTTP-only cookies
Unique Aadhar validation
One Vote per User restriction
User privacy protected (Admin only sees User _id, not personal details)

🧠 Vote Flow Logic => 
User registers and logs in
User fetches candidate list
User votes for one candidate

System: => 
Prevents duplicate voting
Increments candidate voteCount
Stores vote timestamp

Admin can: => 
View live vote percentage
Track total votes
See current winner

🛠️ Tech Stack => 
Node.js
Express.js
MongoDB
Mongoose
JWT
Bcryp
Cookie-Parser

📊 Live Vote Calculation Logic => 
Uses MongoDB Aggregation ($group)
Calculates total votes
Computes percentage per candidate
Sorts winner using descending voteCount

📌 Future Improvements => 
Email verification
Election time window (start/end date)
Admin dashboard UI
Rate limiting
Audit logs

🎯 Project Highlights (Resume Ready Points)=> 
Designed a secure role-based online voting backend with JWT authentication
Implemented real-time vote tracking and winner detection using MongoDB aggregation
Built a one-person-one-vote enforcement system with privacy protection
Developed structured RESTful APIs with proper error handling and modular architecture

Integrated refresh token rotation for enhanced security
