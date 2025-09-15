# TCB - MSTSC DMS

## Document Management System for both Thor Custom's Brokerage and Mighty Star Trucking Services Company

## Technology Stack

**Programming Languages** → [TypeScript](https://www.typescriptlang.org), [Python](https://www.python.org)

**Data Processing** → Python + [Pandas](https://pandas.pydata.org), [Numpy](https://numpy.org)

**Desktop Application Framework** → [Electron](https://www.electronjs.org)

**Frontend** → TypeScript + [React](https://react.dev), [Material UI](https://mui.com/material-ui), [Day.js](https://day.js.org)

**Backend** → TypeScript + [Express](https://expressjs.com), [pdfmake](https://pdfmake.github.io/docs/0.3), [PostgreSQL](https://www.postgresql.org), [Prisma](https://www.prisma.io), [Supabase](https://supabase.com), [Vercel](https://vercel.com) 

## Setting up the data processing project
Move to the *data-processing* folder and do:
```bash
python -m venv env
pip install -r requirements.txt
```

#### Activate the environment and install the required packages:
```bash
python -m venv env
pip install -r requirements.txt
```

*This Python project uses excel and pdf files from the company. Unfortunately, these sample files couldn't be provided since these are billing statements and statement of accounts. However, the solution can be viewed on how these files were organized. The output of this solution can be viewed in* **backlogs.json** *or in* **backlogs.ts** (***electron → src → ui → data → backlogs.ts***) *to see how it's used in the application.*

## Setting up the frontend (Electron, React)
Move to the *electron* folder and do:
```bash
npm install
```

#### Run the frontend in development:
```bash
npm run dev
```

#### Building the project (Windows / Mac / Linux)
Use the proper command based on your device's Operating System:

```bash
npm run dist:mac
npm run dist:win
npm dist:linux
```

## Setting up the backend (Express, Prisma, Supabase)
Move to the *rest-api* folder and do:

```bash
npm install
npm run generate
npm run migrate
npm run seed
```
This project uses both **Supabase** and its ***realtime*** feature. To test this out, a new Supabase project should be created and tables should be migrated to that project:

#### Run the backend in development:
```bash
npm run start
```