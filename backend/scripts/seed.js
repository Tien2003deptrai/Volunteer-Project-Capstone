import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../utils/db.js";
import { User } from "../models/user_model.js";
import { Organization } from "../models/organization_model.js";
import { Duty } from "../models/duty_model.js";
import { Application } from "../models/application_model.js";
import { Group } from "../models/group_model.js";
import { Post } from "../models/post_model.js";
import { Comment } from "../models/comment_model.js";

dotenv.config();

// Fake data arrays
const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Emily", "Chris", "Lisa", "Tom", "Anna", "James", "Maria", "Robert", "Emma", "William", "Olivia", "Michael", "Sophia", "Daniel", "Isabella"];
const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const skills = ["Teaching", "Communication", "Event Planning", "Social Work", "Counseling", "Public Speaking", "Programming", "Web Development", "Management", "Leadership", "Environmental Science", "Project Management", "Education", "Curriculum Development", "Healthcare", "Digital Literacy", "Marketing", "Design", "Writing", "Research"];
const locations = ["New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA", "Philadelphia, USA", "San Antonio, USA", "San Diego, USA", "Dallas, USA", "San Jose, USA"];
const jobTypes = ["Part-time", "Full-time", "Volunteer", "Contract", "Internship"];
const dutyTitles = [
  "Environmental Education Volunteer", "Tree Planting Coordinator", "After-School Tutor", "Curriculum Developer",
  "Health Camp Volunteer", "Digital Literacy Instructor", "Community Outreach Specialist", "Youth Mentor",
  "Food Bank Volunteer", "Homeless Shelter Assistant", "Animal Shelter Helper", "Senior Care Companion",
  "Library Assistant", "Park Cleanup Coordinator", "Disaster Relief Volunteer", "Fundraising Coordinator",
  "Event Organizer", "Social Media Manager", "Grant Writer", "Research Assistant",
  "Teaching Assistant", "Mentor Program Coordinator", "Workshop Facilitator", "Community Garden Manager",
  "Recycling Program Leader", "Beach Cleanup Organizer", "Reading Program Volunteer", "STEM Tutor",
  "Art Program Instructor", "Music Teacher Volunteer"
];
const dutyDescriptions = [
  "Help educate children and adults about environmental conservation through workshops and awareness campaigns.",
  "Lead tree planting initiatives in urban areas and coordinate with local communities.",
  "Provide one-on-one and group tutoring sessions for elementary and middle school students.",
  "Develop educational curricula and create lesson plans for various subjects.",
  "Assist in organizing and running health camps for underserved communities.",
  "Teach basic computer and internet skills to seniors and adults.",
  "Engage with local communities to promote social programs and initiatives.",
  "Mentor young people and provide guidance for personal and professional development.",
  "Help distribute food and organize food bank operations.",
  "Assist in daily operations of homeless shelters and support residents.",
  "Care for animals and help with adoption processes at animal shelters.",
  "Provide companionship and support to elderly community members.",
  "Help organize books and assist visitors at local libraries.",
  "Coordinate park cleanup events and environmental conservation efforts.",
  "Provide support during natural disasters and emergency situations.",
  "Organize fundraising events and campaigns for non-profit organizations.",
  "Plan and execute community events and gatherings.",
  "Manage social media presence and create engaging content.",
  "Write grant proposals and funding applications for organizations.",
  "Assist with research projects and data collection.",
  "Support teachers in classrooms and help with student activities.",
  "Coordinate mentorship programs and match mentors with mentees.",
  "Facilitate workshops on various topics for community members.",
  "Manage community gardens and teach sustainable gardening practices.",
  "Lead recycling programs and educate about waste management.",
  "Organize beach cleanup events and marine conservation efforts.",
  "Volunteer in reading programs to improve literacy rates.",
  "Tutor students in Science, Technology, Engineering, and Mathematics.",
  "Instruct art classes and help with creative projects.",
  "Teach music lessons and organize musical performances."
];
const requirements = [
  ["Passion for the cause", "Good communication skills", "Ability to work with diverse groups"],
  ["Experience in coordination", "Leadership skills", "Physical fitness"],
  ["Teaching experience preferred", "Patience and empathy", "Background check required"],
  ["Degree in related field", "Strong writing skills", "Research experience"],
  ["Interest in healthcare", "Good interpersonal skills", "Flexible schedule"],
  ["Strong computer skills", "Teaching experience", "Patience with learners"],
  ["Community engagement experience", "Excellent communication", "Cultural sensitivity"],
  ["Mentoring experience", "Good listening skills", "Commitment to youth development"],
  ["Physical ability to lift", "Teamwork skills", "Compassion for others"],
  ["Empathy and understanding", "Ability to work in challenging environments", "Flexible hours"]
];
const organizationNames = [
  "Green Earth Initiative", "Education for All Foundation", "Community Health Center",
  "Youth Empowerment Network", "Food Security Alliance", "Animal Welfare Society",
  "Senior Care Foundation", "Literacy for Everyone", "Environmental Action Group",
  "Community Development Organization"
];
const organizationDescriptions = [
  "A non-profit organization dedicated to environmental conservation and sustainability.",
  "Committed to providing quality education to underprivileged children.",
  "Providing free healthcare services and health education to underserved communities.",
  "Empowering young people through mentorship and skill development programs.",
  "Fighting hunger and food insecurity in local communities.",
  "Protecting and caring for animals in need.",
  "Supporting elderly community members with care and companionship.",
  "Promoting literacy and education for all ages.",
  "Leading environmental conservation and sustainability initiatives.",
  "Supporting community development and social programs."
];
const websites = [
  "https://greenearth.org", "https://educationforall.org", "https://communityhealth.org",
  "https://youthempowerment.org", "https://foodsecurity.org", "https://animalwelfare.org",
  "https://seniorcare.org", "https://literacyforall.org", "https://environmentalaction.org",
  "https://communitydev.org"
];
const postContents = [
  "Great session today! Thanks to everyone who participated.",
  "Looking forward to our next meeting. Don't forget to bring your ideas!",
  "Amazing progress this week. Keep up the excellent work!",
  "Reminder: Our event is coming up soon. Please confirm your attendance.",
  "Thank you all for your dedication and hard work.",
  "Excited to share some updates from our recent activities.",
  "Let's continue making a positive impact in our community!",
  "Great to see everyone at today's gathering.",
  "Don't forget to submit your reports by Friday.",
  "Congratulations to everyone on completing the project!"
];
const commentContents = [
  "Great work everyone!", "Looking forward to the next event.", "Thanks for organizing this!",
  "Count me in!", "This is amazing!", "Keep up the good work!", "I'm excited to participate!",
  "Thanks for the update!", "This is very helpful.", "Great initiative!"
];
const imageUrls = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800"
];

// Helper functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const getRandomDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};
const getRandomPhone = () => Math.floor(1000000000 + Math.random() * 9000000000);

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Duty.deleteMany({});
    await Application.deleteMany({});
    await Group.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log("Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = [];

    // Create admin user
    const adminUser = await User.create({
      fullname: "Admin User",
      email: "admin@changemakers.com",
      phoneNumber: 1234567890,
      password: hashedPassword,
      role: "admin",
      profile: {
        bio: "Administrator of Change Makers platform",
        skills: ["Management", "Leadership"],
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    });
    users.push(adminUser);

    // Create 19 regular users
    const usedEmails = new Set();
    for (let i = 0; i < 19; i++) {
      let firstName, lastName, email;
      let attempts = 0;

      // Ensure unique email
      do {
        firstName = getRandomElement(firstNames);
        lastName = getRandomElement(lastNames);
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`;
        attempts++;
      } while (usedEmails.has(email) && attempts < 100);

      usedEmails.add(email);

      const user = await User.create({
        fullname: `${firstName} ${lastName}`,
        email: email,
        phoneNumber: getRandomPhone(),
        password: hashedPassword,
        role: "user",
        profile: {
          bio: `${getRandomElement(["Passionate volunteer", "Community advocate", "Social worker", "Educator", "Environmentalist"])} looking to make a difference`,
          skills: getRandomElements(skills, Math.floor(Math.random() * 4) + 2),
          profilePhoto: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400`,
        },
      });
      users.push(user);
    }

    // Create organizations
    console.log("Creating organizations...");
    const organizations = [];
    for (let i = 0; i < 10; i++) {
      // First 3 organizations are owned by admin, rest by random users
      const orgOwner = i < 3 ? adminUser : users[Math.floor(Math.random() * 19) + 1];
      const org = await Organization.create({
        name: organizationNames[i],
        description: organizationDescriptions[i],
        website: websites[i],
        location: getRandomElement(locations),
        logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200",
        userId: orgOwner._id,
      });
      organizations.push(org);
    }

    // Create duties
    console.log("Creating duties...");
    const duties = [];
    // Get admin-owned organizations (first 3)
    const adminOrganizations = organizations.slice(0, 3);

    for (let i = 0; i < 30; i++) {
      // First 10 duties are created by admin (using admin organizations)
      // Rest are created by random users
      let org, orgOwner;
      if (i < 10) {
        // Admin duties - use admin organizations
        org = getRandomElement(adminOrganizations);
        orgOwner = adminUser;
      } else {
        // Regular user duties
        org = getRandomElement(organizations);
        orgOwner = users.find(u => u._id.toString() === org.userId.toString()) || users[1];
      }

      // Generate dates for upcoming events
      const daysUntilStart = Math.floor(Math.random() * 14) + 1; // 1-14 days
      const startDate = getRandomDate(daysUntilStart);
      const endDate = getRandomDate(daysUntilStart + Math.floor(Math.random() * 30) + 7); // 7-37 days from start
      const daysUntilDeadline = Math.floor(Math.random() * 7) + 1; // 1-7 days
      const deadline = getRandomDate(daysUntilDeadline);

      const duty = await Duty.create({
        tittle: dutyTitles[i % dutyTitles.length],
        description: dutyDescriptions[i % dutyDescriptions.length],
        requirements: getRandomElement(requirements),
        workDuration: Math.floor(Math.random() * 12) + 3, // 3-15 hours
        experienceLevel: Math.floor(Math.random() * 3) + 1, // 1-3
        location: getRandomElement(locations),
        jobType: getRandomElement(jobTypes),
        position: Math.floor(Math.random() * 10) + 1, // 1-10 positions
        organization: org._id,
        created_by: orgOwner._id,
        applications: [],
        startDate: startDate,
        endDate: endDate,
        deadline: deadline,
        images: [getRandomElement(imageUrls), getRandomElement(imageUrls)],
        isOpen: Math.random() > 0.1, // 90% open
      });
      duties.push(duty);
    }

    // Create applications
    console.log("Creating applications...");
    const applications = [];
    const statuses = ["pending", "accepted", "rejected"];

    for (let i = 0; i < 50; i++) {
      const duty = getRandomElement(duties);
      const applicant = getRandomElement(users.filter(u => u.role === "user"));
      const status = getRandomElement(statuses);

      const application = await Application.create({
        duty: duty._id,
        applicant: applicant._id,
        status: status,
      });
      applications.push(application);

      // Update duty with application
      await Duty.findByIdAndUpdate(duty._id, {
        $push: { applications: application._id },
      });
    }

    // Create groups for duties with accepted applications
    console.log("Creating groups...");
    const groups = [];
    const dutiesWithAcceptedApps = duties.filter(duty => {
      const dutyApps = applications.filter(app =>
        app.duty.toString() === duty._id.toString() && app.status === "accepted"
      );
      return dutyApps.length > 0;
    });

    for (const duty of dutiesWithAcceptedApps) {
      const acceptedApps = applications.filter(app =>
        app.duty.toString() === duty._id.toString() && app.status === "accepted"
      );
      const members = acceptedApps.map(app => app.applicant);

      const group = await Group.create({
        duty: duty._id,
        name: `${duty.tittle} - Group`,
        description: `Group for ${duty.tittle} volunteers`,
        members: members,
        created_by: duty.created_by,
      });
      groups.push(group);
    }

    // Create posts for groups
    console.log("Creating posts...");
    const posts = [];
    for (let i = 0; i < 30; i++) {
      const group = getRandomElement(groups);
      const author = getRandomElement(group.members);

      const post = await Post.create({
        group: group._id,
        author: author,
        content: getRandomElement(postContents),
        images: Math.random() > 0.7 ? [getRandomElement(imageUrls)] : [],
        likes: getRandomElements(group.members, Math.floor(Math.random() * group.members.length)),
        shares: getRandomElements(group.members, Math.floor(Math.random() * 3)),
        comments: [],
      });
      posts.push(post);
    }

    // Create comments for posts
    console.log("Creating comments...");
    for (let i = 0; i < 50; i++) {
      const post = getRandomElement(posts);
      const group = groups.find(g => g._id.toString() === post.group.toString());
      if (!group || group.members.length === 0) continue;

      const author = getRandomElement(group.members);

      const comment = await Comment.create({
        post: post._id,
        author: author,
        content: getRandomElement(commentContents),
        likes: getRandomElements(group.members, Math.floor(Math.random() * 3)),
        replies: [],
        parentComment: null,
      });

      // Update post with comment
      await Post.findByIdAndUpdate(post._id, {
        $push: { comments: comment._id },
      });
    }

    // Count admin-created items
    const adminOrgCount = await Organization.countDocuments({ userId: adminUser._id });
    const adminDutyCount = await Duty.countDocuments({ created_by: adminUser._id });

    console.log("\n✅ Seed data created successfully!");
    console.log("\n📊 Created:");
    console.log(`   - ${await User.countDocuments()} users (1 admin, ${await User.countDocuments({ role: "user" })} regular)`);
    console.log(`   - ${await Organization.countDocuments()} organizations (${adminOrgCount} by admin, ${await Organization.countDocuments() - adminOrgCount} by users)`);
    console.log(`   - ${await Duty.countDocuments()} duties (${adminDutyCount} by admin, ${await Duty.countDocuments() - adminDutyCount} by users)`);
    console.log(`   - ${await Application.countDocuments()} applications`);
    console.log(`   - ${await Group.countDocuments()} groups`);
    console.log(`   - ${await Post.countDocuments()} posts`);
    console.log(`   - ${await Comment.countDocuments()} comments`);
    console.log("\n🔑 Default credentials:");
    console.log("   Email: admin@changemakers.com");
    console.log("   Password: password123");
    console.log("\n   All other users: password123");
    console.log("   Email format: firstname.lastname@example.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
