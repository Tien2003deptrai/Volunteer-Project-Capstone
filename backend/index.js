import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user_route.js';
import dutyRoute from './routes/duty_route.js';
import organizationRoute from './routes/organization_route.js';
import applicationRoute from './routes/application_route.js';
import groupRoute from './routes/group_route.js';
import postRoute from './routes/post_route.js';
import commentRoute from './routes/comment_route.js';
import reportRoute from './routes/report_route.js';
import adminRoute from './routes/admin_route.js';
import friendRoute from './routes/friend_route.js';
import messageRoute from './routes/message_route.js';
import notificationRoute from './routes/notification_route.js';
dotenv.config({});

const app = express();

//middlewares
app.use(express.json()); //Parses JSON payloads from request body.
app.use(express.urlencoded({ extended: true })); //Parses URL-encoded payloads (e.g., forms).
app.use(cookieParser()); //Parses cookies from incoming HTTP requests

const corsOptions = {
  origin: 'http://localhost:5173',
  // origin: 'https://job-portal-website-front-end-e72p.vercel.app', // Frontend URL
  credentials: true, // Ensures cookies are sent
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/duty", dutyRoute);
app.use("/api/v1/organization", organizationRoute);
app.use("/api/v1/app", applicationRoute);
app.use("/api/v1/group", groupRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/friend", friendRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/notification", notificationRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server Running at Port ${PORT}`);
});
