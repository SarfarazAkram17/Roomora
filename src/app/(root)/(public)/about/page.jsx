import Image from "next/image";
import { FaGithub } from "react-icons/fa";

const AboutPage = () => {
  return (
    <section className="my-6 text-center max-w-[1500px] px-4 mx-auto">
      {/* Header */}
      <h2 className="text-4xl font-bold text-[#F7602C] mb-6">
        About the Developer
      </h2>
      <p className="text-lg text-gray-700 mb-3">
        Hello! I'm{" "}
        <span className="text-[#F7602C] font-semibold">Sarfaraz Akram</span>, a
        dedicated and passionate full-stack web developer from Bangladesh.
      </p>
      <p className="text-gray-700 text-base mb-12 leading-relaxed max-w-5xl mx-auto">
        My expertise lies in crafting dynamic, responsive, and user-friendly web
        applications using technologies like <strong>React.js</strong>,{" "}
        <strong>Next.js</strong>, <strong>Tailwind CSS</strong>,{" "}
        <strong>Firebase</strong>, <strong>MongoDB</strong>, and{" "}
        <strong>Express.js</strong>. I’m driven by clean code, great user
        experiences, and scalable backend solutions.
      </p>

      {/* Projects */}
      <h3 className="text-3xl font-bold text-[#F7602C] mb-8">
        🛠️ Other Featured Projects
      </h3>

      <div className="grid gap-4 md:grid-cols-2 text-left">
        {/* Portfolio */}
        <div className="bg-white border-2 border-transparent hover:border-[#BF5B1F] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">👨‍💻</span>
            <h4 className="text-2xl font-bold text-[#F7602C]">Portfolio</h4>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            My personal developer portfolio showcasing my full-stack projects,
            skills.
          </p>
          <a
            href="https://sarfarazakram.netlify.app"
            className="text-blue-600 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 Visit Portfolio
          </a>
        </div>

        {/* Sam's Kitchen */}
        <div className="bg-white border-2 border-transparent hover:border-[#BF5B1F] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://i.ibb.co.com/RpJLT7dR/logo.png"
              alt="Sam's Kitchen"
              height={48}
              width={70}
            />
            <h4 className="text-2xl font-bold text-[#F7602C]">Sam's Kitchen</h4>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Sam's Kitchen is a food delivery and management platform where users
            can order food, riders can deliver orders, and admins can manage the
            entire kitchen system, including foods, payments, and rider
            assignments.
          </p>
          <div className="flex justify-between items-center">
            <a
              href="https://sams-kitchen.netlify.app"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Live Demo
            </a>
            <a
              href="https://github.com/SarfarazAkram17/Sams-Kitchen-Client"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={30} className="hover:text-[#F7602C]" />
            </a>
          </div>
        </div>

        {/* TourNest */}
        <div className="bg-white border-2 border-transparent hover:border-[#BF5B1F] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://i.ibb.co/WNFYmhRy/favicon.png"
              alt="TourNest"
              height={48}
              width={48}
            />
            <h4 className="text-2xl font-bold text-[#F7602C]">TourNest</h4>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            TourNest is a complete tourism management platform that allows users
            to book tour packages, apply as tour guides, share stories, and make
            secure payments, all under a role-based access-controlled
            environment.
          </p>
          <div className="flex justify-between items-center">
            <a
              href="https://tournest-sarfaraz-akram.netlify.app"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Live Demo
            </a>
            <a
              href="https://github.com/SarfarazAkram17/TourNest-Client"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={30} className="hover:text-[#F7602C]" />
            </a>
          </div>
        </div>

        {/* Studify */}
        <div className="bg-white border-2 border-transparent hover:border-[#BF5B1F] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://i.ibb.co/XZt0GXVB/s-removebg-preview.png"
              alt="Studify"
              height={48}
              width={48}
            />
            <h4 className="text-2xl font-bold text-[#F7602C]">Studify</h4>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Studify is a group study platform where students can create
            assignments, submit work, and peer-review submissions with scoring
            and feedback.
          </p>
          <div className="flex justify-between items-center">
            <a
              href="https://studify-sarfaraz-akram.netlify.app"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Live Demo
            </a>
            <a
              href="https://github.com/SarfarazAkram17/Studify-Client"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub size={30} className="hover:text-[#F7602C]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;