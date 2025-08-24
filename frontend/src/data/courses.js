const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    instructor: "John Doe",
    description: "Learn to build modern web applications using React, Node.js, and MongoDB.",
    thumbnail: "https://via.placeholder.com/600x300",
    rating: 4.8,
    lessons: [
      { id: 1, title: "Introduction to Web Development" },
      { id: 2, title: "Frontend with React" },
      { id: 3, title: "Backend with Node.js" },
    ],
  },
  {
    id: 2,
    title: "Data Science for Beginners",
    instructor: "Jane Smith",
    description: "Master data analysis, visualization, and machine learning basics.",
    thumbnail: "https://via.placeholder.com/600x300",
    rating: 4.7,
    lessons: [
      { id: 1, title: "Introduction to Data Science" },
      { id: 2, title: "Python for Data Analysis" },
      { id: 3, title: "Machine Learning Basics" },
    ],
  },
];

export default courses;
