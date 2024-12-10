# Question Vault - RMSTU

A digital repository system for managing and accessing academic exam questions at RMSTU (Rangamati Science and Technology University).

## Live Link

Vercel: [Question Vault RMSTU](https://question-vault-rmstu.vercel.app/)

## Features

- **User Roles**: Supports Super Admin, Admin, and Student access levels
- **Question Management**: Upload, edit, and organize exam questions by semester, course, and exam type
- **Academic Information**: Comprehensive management of faculty, department, degree, and course information
- **Search Functionality**: Advanced search capabilities for finding specific questions
- **Question Bundling**: Create custom question bundles for mid and final exams
- **Secure Authentication**: JWT-based authentication system

## Tech Stack

- Next.js 13+ (App Router)
- MongoDB
- Tailwind CSS
- JWT Authentication
- ImageBB API for image hosting

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/maopu2001/Question-Vault-Rmstu.git
cd Question-Vault-Rmstu
npm install
```

2. Set up environment variables in .env.local:

```bash
MONGODB_URI = your_mongodb_uri
JWT_SECRET = your_jwt_secret
NEXT_PUBLIC_JWT_SECRET = your_public_jwt_secret
IMGBB_URL = your_imgbb_url_with_api_key
MAIL_USER = Your_gmail
MAIL_PASSWORD = app_password_of_your_gmail
SUPER_ADMIN_TOKEN = your_super_admin_token
SUPER_ADMIN_USERNAME = your_super_admin_username
SUPER_ADMIN_PASSWORD = your_super_admin_password
```

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Project Structure

- `/app` - Next.js app router pages and API routes

  - `/api` - Backend API endpoints
  - `/admin` - Admin dashboard and features
  - `/superadmin` - Superadmin management interface
  - `/searchQuestion` - Question search functionality

- `/components` - Reusable React components

  - UI components
  - Form elements
  - Layout components

- `/hooks` - Custom React hooks

- `/lib` - Utility functions and helpers

  - JWT verification
  - API helpers
  - Common utilities

- `/mongoDB` - Database schemas and connection logic
  - Schema definitions
  - Database models
  - MongoDB connection setup

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Developer

**M. Aktaruzzaman Opu** <br>
Rangamati Science and Technology University <br>
Session: 2020-2021 <br>
Bachelor of Science in Engineering - B.Sc.(Engg.) <br>
Department of Computer Science and Engineering <br>

## Contact Information

Email: maopu2001@gmail.com <br>
Faccebook: [M. Aktaruzzaman Opu](https://www.facebook.com/ma.opu.2001/) <br>
GitHub: [maopu2001](https://github.com/maopu2001)

## License

**MIT License**

**Copyright (c) 2024 M. Aktaruzzaman Opu**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

**The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.**

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.**
