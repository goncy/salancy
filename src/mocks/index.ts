import { Category, RawSalary } from "@/salary/types";

const inflation = 1;

const salaries: RawSalary[] = [
    {
        position: "Android Developer",
        currency: "ARS",
        value: 1_000_000,
        seniority: "Junior (1 a 3 años)",
    },
    {
        position: "Android Developer",
        currency: "ARS",
        value: 1_250_000,
        seniority: "Junior (1 a 3 años)",
    },
    {
        position: "Android Developer",
        currency: "USD",
        value: 1_135,
        seniority: "Junior (1 a 3 años)",
    },
    {
        position: "Android Developer",
        currency: "ARS",
        value: 2_000_000,
        seniority: "Semi Senior (3 a 5 años)",
    },
    {
        position: "Android Developer",
        currency: "ARS",
        value: 2_333_333,
        seniority: "Semi Senior (3 a 5 años)",
    },
    {
        position: "Android Developer",
        currency: "ARS",
        value: 2_345_678,
        seniority: "Semi Senior (3 a 5 años)",
    },
    {
        position: "UX/UI Designer",
        currency: "ARS",
        value: 1_500_000,
        seniority: "Iniciante / Trainee (hasta 1 año)",
    },
    {
        position: "UX/UI Designer",
        currency: "USD",
        value: 900,
        seniority: "Iniciante / Trainee (hasta 1 año)",
    },
];

const categories: Category[] = [
    {
        name: "Software Development",
        positions: ["Android Developer"],
    },
    {
        name: "Design & User Experience",
        positions: ["UX/UI Designer"],
    },
];

export default { inflation, categories, salaries };