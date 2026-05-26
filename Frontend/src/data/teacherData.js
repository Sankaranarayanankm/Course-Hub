import { BookOpen, BarChart3 } from "lucide-react";

export const TEACHER_COURSE_STATUS = {
  totalPublishedCourse: 1,
  totalAmount: 999,

  data: {
    "Complete React Course": 120,
    "JavaScript Mastery": 80,
  },
};

// export const TEACHER_SIDEBAR = ["Courses", "Analytics"];

export const TEACHER_SIDEBAR = [
  {
    label: "Courses",
    icon: BookOpen,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
];

export const DUMMY_COURSES = [
  {
    _id: "course_1",
    title: "Complete React Course",
    description: "Learn React from basics to advanced level",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    category: "Web Development",
    attachment: "react-notes.pdf",
    price: 999,
    purchasedCount: 120,
    teacher: "teacher_1",
    isPublished: true,
    chapters: [
      {
        _id: "chapter_1",
        title: "Introduction to React",
        description:
          "Understand what React is and why it is used for building user interfaces.",
        isFree: true,
        video: "react-introduction.mp4",
        isPublished: true,
      },
      {
        _id: "chapter_2",
        title: "JSX Fundamentals",
        description: "Learn JSX syntax and how React renders UI components.",
        isFree: false,
        video: "jsx-fundamentals.mp4",
        isPublished: true,
      },
      {
        _id: "chapter_3",
        title: "React Components",
        description:
          "Understand functional components and component structure.",
        isFree: false,
        video: "react-components.mp4",
        isPublished: true,
      },
    ],
  },

  {
    _id: "course_2",
    title: "JavaScript Mastery",
    description: "Deep dive into JavaScript concepts",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    category: "Programming",
    attachment: "js-guide.pdf",
    price: 799,
    purchasedCount: 80,
    teacher: "teacher_1",
    isPublished: false,
    chapters: [
      {
        _id: "chapter_4",
        title: "Props and State",
        description: "Learn how to pass data using props and manage state.",
        isFree: false,
        video: "props-state.mp4",
        isPublished: true,
      },
      {
        _id: "chapter_5",
        title: "Handling Events",
        description: "Learn event handling and user interaction in React.",
        isFree: false,
        video: "events.mp4",
        isPublished: false,
      },
    ],
  },

  {
    _id: "course_3",
    title: "Node.js Backend Bootcamp",
    description: "Build scalable backend APIs using Node.js",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    category: "Backend Development",
    attachment: "node-notes.pdf",
    price: 1299,
    purchasedCount: 65,
    teacher: "teacher_1",
    isPublished: true,
    chapters: [
      {
        _id: "chapter_6",
        title: "React Hooks Basics",
        description: "Introduction to useState and useEffect hooks.",
        isFree: false,
        video: "hooks-basics.mp4",
        isPublished: true,
      },
      {
        _id: "chapter_7",
        title: "Routing with React Router",
        description: "Learn navigation and routing in React applications.",
        isFree: false,
        video: "react-router.mp4",
        isPublished: false,
      },
    ],
  },
];
