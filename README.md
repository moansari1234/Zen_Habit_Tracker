<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zenith Habit Tracker

Zenith is a modern, responsive habit tracking application built with React. It helps you cultivate positive habits and achieve your goals with a beautiful and intuitive interface. Track your progress, visualize your consistency, and stay motivated on your journey to self-improvement.

View your app in AI Studio: https://ai.studio/apps/drive/1Ur22MvQOjC31s0SPxzt-FLJZyqxwuEVX

## Features

*   **Create and Manage Habits:** Easily add new habits you want to track.
*   **Track Daily Progress:** Mark habits as complete for each day.
*   **Multiple Views:** Visualize your habits in a list or a full-year calendar view.
*   **Profile Page:** View your stats and manage your profile.
*   **Light/Dark Mode:** Switch between light and dark themes for your comfort.
*   **Data Export:** Export your habit data to a CSV file.
*   **Responsive Design:** Works beautifully on desktop and mobile devices.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server.
*   **TypeScript:** A typed superset of JavaScript.
*   **React Router:** For routing and navigation.

## Run Locally

**Prerequisites:**

*   [Node.js](https://nodejs.org/) installed on your machine.
*   A Gemini API key.

**Setup:**

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/google/generative-ai-docs/tree/main/apps/demos/zenith-habit-tracker
    cd zenith-habit-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run preview`: Previews the production build locally.
