import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import heroImage from "../assets/Images/heroimage.jpg";
import { Link } from "react-router-dom";
// --- 1. Import your local video file ---
import promoVideo from "../assets/promo-video.mp4"; 

// ... (The rest of your component logic remains the same) ...
const HorizontalCourseCard = ({ course }) => (
  <div className="min-w-[280px] bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex-shrink-0">
    <Link to={`/course/${course._id}`} className="block">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-md font-semibold mb-1 truncate">{course.title}</h3>
      <p className="text-sm text-gray-500">By {course.instructor?.name || 'N/A'}</p>
    </Link>
  </div>
);

const GridCourseCard = ({ course }) => (
    <Link to={`/course/${course._id}`} className="bg-white rounded-xl shadow p-4 hover:bg-gray-50 hover:shadow-md transition block">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg font-bold">{course.title}</h3>
    </Link>
);


export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const courseScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const allCoursesRes = await axios.get('http://localhost:5000/api/courses');
        const allCourses = allCoursesRes.data;

        const uniqueCategories = [...new Set(allCourses.map(course => course.category))];
        setCategories(['All', ...uniqueCategories]);

        setRecommendedCourses([...allCourses].sort((a, b) => b.rating - a.rating).slice(0, 3));

      } catch (err) {
        setError('Failed to load page data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredCourses = async () => {
        try {
            const categoryParam = activeCategory === 'All' ? '' : `?category=${encodeURIComponent(activeCategory)}`;
            const filteredCoursesRes = await axios.get(`http://localhost:5000/api/courses${categoryParam}`);
            setCourses(filteredCoursesRes.data);
        } catch (err) {
            console.error("Failed to fetch filtered courses", err);
        }
    };
    
    if (!loading) {
        fetchFilteredCourses();
    }
  }, [activeCategory, loading]);

  const scrollCourses = (direction) => {
    if (courseScrollRef.current) {
      const scrollAmount = 300;
      courseScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* ... (Hero and Career sections remain the same) ... */}
      <div
        className="bg-gray-100 w-full px-4 py-12"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 relative">
          <div className="bg-white bg-opacity-90 p-8 rounded shadow-lg z-10">
            <h1 className="text-4xl font-bold leading-snug mb-4">
              Jump into learning <span className="text-purple-600">for less</span>
            </h1>
            <p className="text-gray-700 mb-6">
              Share your skills, learn from others, and grow together in a vibrant community.
            </p>
            <div className="flex gap-4">
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                Get Started
              </Link>
              <Link to="/Skills" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition">
                Browse Skills
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Ready to reimagine your <span className="text-purple-600">career</span>?
          </h2>
          <p className="text-gray-600 text-lg">
            Get the skills and real-world experience employers want with SkillShare Career Tracks.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <Link to="/skills?category=Web%20Development" className="bg-white rounded-xl shadow p-4 hover:bg-gray-50 hover:shadow-md transition block">
            <img src="https://placehold.co/600x400/7E57C2/FFFFFF?text=Web+Dev" alt="Web Development" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-bold">Web Development</h3>
          </Link>
          <Link to="/skills?category=IT" className="bg-white rounded-xl shadow p-4 hover:bg-gray-50 hover:shadow-md transition block">
            <img src="https://placehold.co/600x400/42A5F5/FFFFFF?text=IT+Certs" alt="IT Certifications" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-bold">IT</h3>
          </Link>
          <Link to="/skills?category=Data%20Science" className="bg-white rounded-xl shadow p-4 hover:bg-gray-50 hover:shadow-md transition block">
            <img src="https://placehold.co/600x400/66BB6A/FFFFFF?text=Data+Science" alt="Data Scientist" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-bold">Data Scientist</h3>
          </Link>
        </div>
        <div className="text-center mt-8">
          <Link to="/Skills" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition">
            Browse All Skills
          </Link>
        </div>
      </section>

      {/* --- UPDATED: A Glance Into SkillShare Section --- */}
      <section className="bg-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left: Video */}
          <div className="flex justify-center">
            {/* 2. Replace the iframe with a <video> tag */}
            <video
              controls
              src={promoVideo}
              className="rounded-lg shadow w-full max-w-md"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          {/* Right: Text */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              A Glance Into <span className="text-purple-600">SkillShare</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our vibrant community, discover unique skills, and connect with passionate learners and teachers.
            </p>
          </div>
        </div>
      </section>
      
      {/* ... (The rest of the page remains the same) ... */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Browse Skills by <span className="text-purple-600">Category</span>
          </h2>
        </div>
        <div className="mt-10">
          {/* --- UPDATED CATEGORY BUTTONS --- */}
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-md font-semibold transition-all duration-300 ease-in-out shadow-sm ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-10 relative">
            <button onClick={() => scrollCourses("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-blue-100 transition flex items-center justify-center" style={{ width: "48px", height: "48px" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M18 22L10 14L18 6" stroke="#232742" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => scrollCourses("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 hover:bg-blue-100 transition flex items-center justify-center" style={{ width: "48px", height: "48px" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M10 6L18 14L10 22" stroke="#232742" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div ref={courseScrollRef} className="flex overflow-x-auto gap-6 pb-4 no-scrollbar scroll-smooth">
              {courses.length > 0 ? (
                courses.map((course) => <HorizontalCourseCard key={course._id} course={course} />)
              ) : (
                !loading && <p>No courses found in this category.</p>
              )}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to={`/skills?category=${encodeURIComponent(activeCategory)}`} className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition">
              Explore {activeCategory}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Recommended <span className="text-purple-600">Courses & Skills</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked for you based on your interests and trending topics.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommendedCourses.map((course) => <GridCourseCard key={course._id} course={course} />)}
        </div>
      </section>

      <section className="bg-white py-16 px-4">
  <div className="max-w-4xl mx-auto text-center mb-12">
    <h2 className="text-3xl font-bold mb-2">
      Frequently Asked <span className="text-purple-600">Questions</span>
    </h2>
    <p className="text-gray-600 text-lg">
      Find answers to common questions about SkillShare.
    </p>
  </div>
  <div className="max-w-4xl mx-auto">
    <div className="space-y-6">
      <details className="bg-gray-100 rounded-lg p-6 shadow">
        <summary className="cursor-pointer font-semibold text-lg text-blue-900">How do I sign up?</summary>
        <p className="mt-2 text-gray-700">
          Click the "Get Started" button at the top of the page and fill out the registration form to create your account.
        </p>
      </details>
      <details className="bg-gray-100 rounded-lg p-6 shadow">
        <summary className="cursor-pointer font-semibold text-lg text-blue-900">Can I teach my own course?</summary>
        <p className="mt-2 text-gray-700">
          Yes! Anyone can apply to become an instructor. Visit the "Teach on SkillShare" page for more information.
        </p>
      </details>
      <details className="bg-gray-100 rounded-lg p-6 shadow">
        <summary className="cursor-pointer font-semibold text-lg text-blue-900">Is there a mobile app?</summary>
        <p className="mt-2 text-gray-700">
          Yes, you can download our app from the App Store or Google Play to learn on the go.
        </p>
      </details>
      <details className="bg-gray-100 rounded-lg p-6 shadow">
        <summary className="cursor-pointer font-semibold text-lg text-blue-900">How do I contact support?</summary>
        <p className="mt-2 text-gray-700">
          You can reach our support team via the "Help & Support" link in the footer.
        </p>
      </details>
    </div>
  </div>
</section>

<footer className="bg-gray-900 text-gray-200 py-12 mt-12">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
    <div>
      <h4 className="font-bold text-lg mb-4">About</h4>
      <ul className="space-y-2">
        <li><a href="/about" className="hover:text-purple-400 transition">About Us</a></li>
        <li><a href="/careers" className="hover:text-purple-400 transition">Careers</a></li>
        <li><a href="/contact" className="hover:text-purple-400 transition">Contact Us</a></li>
        <li><a href="/blog" className="hover:text-purple-400 transition">Blog</a></li>
        <li><a href="/investors" className="hover:text-purple-400 transition">Investors</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold text-lg mb-4">Discover SkillShare</h4>
      <ul className="space-y-2">
        <li><a href="/app" className="hover:text-purple-400 transition">Get the App</a></li>
        <li><Link to="/create-course" className="hover:text-purple-400 transition">Teach on SkillShare</Link></li>
        <li><a href="/plans" className="hover:text-purple-400 transition">Plans and Pricing</a></li>
        <li><a href="/affiliate" className="hover:text-purple-400 transition">Affiliate</a></li>
        <li><a href="/help" className="hover:text-purple-400 transition">Help & Support</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold text-lg mb-4">SkillShare for Business</h4>
      <ul className="space-y-2">
        <li><a href="/business" className="hover:text-purple-400 transition">SkillShare Business</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold text-lg mb-4">Legal & Accessibility</h4>
      <ul className="space-y-2">
        <li><a href="/accessibility" className="hover:text-purple-400 transition">Accessibility Statement</a></li>
        <li><a href="/privacy" className="hover:text-purple-400 transition">Privacy Policy</a></li>
        <li><a href="/sitemap" className="hover:text-purple-400 transition">Sitemap</a></li>
        <li><a href="/terms" className="hover:text-purple-400 transition">Terms</a></li>
      </ul>
    </div>
  </div>
  <div className="max-w-7xl mx-auto px-4 mt-8 text-center text-sm text-gray-400">
    <span className="font-bold text-lg text-gray-200">SkillShare</span>
    <span className="ml-2">© {new Date().getFullYear()} All rights reserved.</span>
  </div>
</footer>
    </>
  );
}
