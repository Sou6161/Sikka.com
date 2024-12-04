import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import logo from "/Sourabh Web dev Projects/Sikka.com/src/Images Folder/HeaderLogo.png";

const Footer = () => {
  return (
    <footer className="  relative overflow-hidden  bg-gray-900 text-gray-300 -left-4 min-w-[100vw] xlarge:-left-[6.6vw]  2xlarge:-left-[6.3vw]  ">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute  inset-0  bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 animate-gradient"></div>
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xsmall:grid-cols-2 medium:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img className=" mb-4  h-[5vh] object-cover" src={logo} alt="" />
            <p className="mb-4 xlarge:text-[1.2vw]">
              Empowering your crypto journey with cutting-edge solutions and
              expert insights.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
              
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="medium:ml-[10vw] medium:text-nowrap">
            <h3 className="text-lg font-semibold text-white mb-4  medium:mt-2 ">
              Quick Links
            </h3>
            <ul className="space-y-2 xlarge:text-[1.3vw] ">
              <li>
                <a href="#" className="hover:text-white  transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className=" medium:ml-[10vw] xlarge:mt-2 medium:text-nowrap">
            <h3 className="text-lg font-semibold  text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 medium:mr-0" />
                <a
                  href="#"
                  onClick={() => window.location = "mailto:info@coinfam.com"}
                  className="hover:text-white transition-colors xlarge:text-[1.vw]"
                >
                  info@coinfam.com
                </a>
              </li>
              <li className=" medium:whitespace-nowrap">123 Crypto Street</li>
              <li className=" medium:whitespace-nowrap">
                Blokchain City, CC 12345
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm medium:text-[1.8vw] xlarge:text-[1.5vw] text-center">
          <p>&copy; 2024 CoinFam. All rights reserved.</p>
        </div>
      </div>
      <style jsx="true">{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
