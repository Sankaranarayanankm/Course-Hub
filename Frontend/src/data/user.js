export const USER = {
  _id: "teacher_1",
  name: "Sankara Teacher",
  email: "teacher@gmail.com",
  role: "teacher",

  createdCourses: ["course_1", "course_2"],
  purchasedCourses: [],
};

export const COURSES = [
  {
    _id: "course_1",
    title: "Complete React Course",
    description: "Learn React from beginner to advanced",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    category: "Web Development",
    attachment: "react-notes.pdf",
    price: 999,
    purchasedCount: 120,
    teacher: "teacher_1",
    isPublished: true,
    chapters: ["chapter_1", "chapter_2", "chapter_3"],
  },

  {
    _id: "course_2",
    title: "JavaScript Mastery",
    description: "Master JavaScript concepts deeply",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    category: "Programming",
    attachment: "javascript-guide.pdf",
    price: 799,
    purchasedCount: 80,
    teacher: "teacher_1",
    isPublished: false,
    chapters: ["chapter_4", "chapter_5"],
  },
];

export const CHAPTERS = [
  {
    _id: "chapter_1",
    title: "React Introduction",
    description: "Understand what React is",
    isFree: true,
    video: "intro-react.mp4",
    isPublished: true,
  },

  {
    _id: "chapter_2",
    title: "JSX Fundamentals",
    description: "Learn JSX syntax",
    isFree: false,
    video: "jsx.mp4",
    isPublished: true,
  },

  {
    _id: "chapter_3",
    title: "React Components",
    description: "Learn reusable components",
    isFree: false,
    video: "components.mp4",
    isPublished: true,
  },

  {
    _id: "chapter_4",
    title: "JavaScript Basics",
    description: "Variables, functions and arrays",
    isFree: true,
    video: "js-basics.mp4",
    isPublished: true,
  },

  {
    _id: "chapter_5",
    title: "Closures and Scope",
    description: "Deep dive into closures",
    isFree: false,
    video: "closures.mp4",
    isPublished: false,
  },
];

export const PROGRESS = [
  {
    _id: "progress_1",
    student: "student_1",
    course: "course_1",
    chaptersCompleted: ["chapter_1", "chapter_2"],
  },

  {
    _id: "progress_2",
    student: "student_2",
    course: "course_1",
    chaptersCompleted: ["chapter_1"],
  },
];
