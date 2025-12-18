# ycTinder Server

This repository contains the **server-side** code for **ycTinder**, a real-world dating application.  

The **client-side** (frontend) code is hosted separately: [ycTinder Client](https://github.com/yeyulpro/yc-devTinder-web-v2.git).  

**Live Demo:** [yctiner.online](https://yctiner.online)  

**ycTinder** allows users to browse profiles, express interest, and accept incoming interest requests to form matches. The server handles API endpoints, authentication, real-time chat, and email notifications.  

---

## Features
- **Express Interest**: Users can indicate interest in other profiles by clicking **Interested** or **Ignored**.  
- **Accept Requests**: Accept or reject incoming interest requests to form matches.  
- **Email Notifications**: When both users accept, a match is created, and an email notification is sent to inform users of their new connection.  
- **Connections & Chat**: Matched users appear in the **Connections** section, where they can chat one-on-one in real time.  
- **Real-time Updates**: Powered by WebSockets (**Socket.io**) for instant notifications on matches and messages.  

---

## Tech Stack
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Real-time Communication:** Socket.io  
- **Email Notifications:** AWS SNS  

---

## Deployment
The server is deployed on **AWS EC2**, demonstrating experience with cloud deployment and production-ready application management.  

**Access the live app:** [yctiner.online](https://yctiner.online)  
