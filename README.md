# Fullstack Creat BLog: Next.js, React, Convex, Tailwind 

- Light and Dark mode 🌓
- Trash can & soft delete 🗑️
- Authentication 🔐 
- File upload
- File deletion
- File replacement
- Full mobile responsiveness 📱
- Publish your note to the web 🌐
- Recover deleted files 🔄📄

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/TranThenhan/Blog-Devops.git
```

### Install packages

```shell
npm i
```

### Setup .env file
- [link Convex](https://www.convex.dev/)
- [link Clerk](https://clerk.com/)
- [link Egdestore](https://edgestore.dev/docs/quick-start)

```js
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=
```

### Setup Convex

```shell
npx convex dev

```

### Start the app

```shell
npm run dev
```
