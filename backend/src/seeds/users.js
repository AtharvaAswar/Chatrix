import { config } from "dotenv";
import { connectDb } from "../Lib/db.js";
import User from "../Models/user.js";

config();

const seedUsers = [
    // Female Users
    {
        email: "olivia.miller@example.com",
        fullName: "Olivia Miller",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
        email: "sophia.davis@example.com",
        fullName: "Sophia Davis",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
        email: "ava.wilson@example.com",
        fullName: "Ava Wilson",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/women/4.jpg",
    },

    // Male Users
    {
        email: "william.clark@example.com",
        fullName: "William Clark",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        email: "benjamin.taylor@example.com",
        fullName: "Benjamin Taylor",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        email: "henry.jackson@example.com",
        fullName: "Henry Jackson",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        email: "daniel.rodriguez@example.com",
        fullName: "Daniel Rodriguez",
        password: "123456",
        profileImg: "https://randomuser.me/api/portraits/men/7.jpg",
    },
];

const seedDatabase = async () => {
    try {
        await connectDb();

        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
seedDatabase();