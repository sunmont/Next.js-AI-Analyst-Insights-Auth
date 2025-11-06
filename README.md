# Analytics Pro

## Project Description

Analytics Pro is a comprehensive web application built with Next.js, designed to provide real-time analytics and insights. It features a dashboard for visualizing key metrics, AI-powered analysis, and robust authentication.

## Features

*   **Real-time Analytics:** Display and monitor data with real-time charts.
*   **AI Analyst Chat:** Interact with an AI to gain deeper insights from your data.
*   **Dashboard:** A central hub for viewing various metrics and reports.
*   **Authentication:** Secure user authentication powered by NextAuth.js.
*   **Date Range Picker:** Filter data by custom date ranges.

## Technologies Used

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (inferred from `postcss.config.mjs` and `globals.css`)
*   **Database:** Prisma (with SQLite for development, inferred from `prisma/schema.prisma`)
*   **Authentication:** NextAuth.js
*   **AI Integration:** Vercel AI SDK (inferred from `src/app/api/ai`)
*   **Data Fetching:** React Query (inferred from `src/lib/query-client.ts` and `src/providers/query-provider.tsx`)

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (v18 or higher)
*   npm or yarn
*   Git

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/analytics-pro.git
    cd analytics-pro
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add the necessary environment variables. You can copy from `.env` as a template.

    ```env
    # Example .env.local content
    DATABASE_URL="file:./prisma/dev.db"
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
    NEXTAUTH_URL="http://localhost:3000"
    OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
    ```

    *   `DATABASE_URL`: Connection string for your database. For development, it's configured to use a local SQLite file.
    *   `NEXTAUTH_SECRET`: A random string used to hash tokens, sign/encrypt cookies, and generate a csrf token. You can generate one using `openssl rand -base64 32`.
    *   `NEXTAUTH_URL`: The URL of your application.
    *   `OPENAI_API_KEY`: Your API key for OpenAI services, used for AI features.

4.  **Initialize the database:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
analytics-pro/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   │   ├── (dashboard)/  # Dashboard specific pages
│   │   ├── api/          # API routes (e.g., AI, analytics, auth)
│   │   └── auth/         # Authentication related pages
│   ├── components/       # Reusable UI components
│   │   ├── ai/           # AI-specific components
│   │   ├── auth/         # Auth-specific components
│   │   ├── charts/       # Chart components
│   │   ├── metrics/      # Metric display components
│   │   └── ui/           # Shadcn UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations (e.g., API, auth, prisma)
│   ├── providers/        # Context providers (e.g., AuthProvider, QueryProvider)
│   └── types/            # TypeScript type definitions
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets
├── .env.local          # Environment variables
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details. (Assuming MIT License, create a LICENSE file if not present.)