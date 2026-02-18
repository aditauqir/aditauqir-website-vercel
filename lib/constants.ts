export type ProjectItem =
{
    github_url: string;
    title: string;
    description: string;
};

export const PROJECTS: ProjectItem[] = [
    {
        github_url: "https://github.com/aditauqir/Zaman",
        title: "Zaman",
        description: "Terminal-based progress dashboard CLI built in Python with secure JSON-backed auth, SHA-256 password hashing, and modular UI components."
    },
    {
        github_url: "https://github.com/aditauqir/Arca-dev",
        title: "Arca AI",
        description: "Web study platform that converts PDFs/slides into structured concepts and spaced-repetition reviews, with dashboards showing long-term progress."
    },
    {
        github_url: "https://github.com/aditauqir/recession-model",
        title: "Recession Prediction Model",
        description: "Macro model using FRED economic time series and historical trends to estimate recession risk over time."
    }
];
