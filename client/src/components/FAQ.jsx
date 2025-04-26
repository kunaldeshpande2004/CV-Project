//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR  DEPLOYMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE FAQ.JSX LINE 64 - LINE 218
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS//
// DATE OF DEVELOPMENT START OF FAQ.JSX 20/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component displays the FAQ (Frequently Asked Questions) section of the Pregnancy Tracker application. 
// It provides users with essential information about the app's features, such as tracking pregnancy stages, 
// reminders, and more. 
// The FAQ component also includes a contact section with email, phone, and address details for further assistance.
/*FAQ Display System:

Dynamic accordion-based FAQ system.

Users can expand and collapse each question to view the answer.

Contact Information:

Displays official email, phone number, and office address.

Provides direct clickable links for email and phone calls.

Dynamic UI Components:

Collapsible panels for each FAQ entry.

Icons for contact information.

Top fixed navigation bar with company logo and sidebar integration.

Error Handling and Validation:

Ensures all FAQ entries are correctly rendered.
*/

// Key Libraries and Dependencies
/*
React: Core library for building the UI.

React Router: Navigation handled via react-router.

Tailwind CSS: Provides styling for layout and components.

React Icons: Used for email, phone, and location icons.

Custom Components: Uses the SideBar component for consistent navigation.
*/

//Data Flow:
/*
Static data for FAQs is mapped to render UI.

Contact details are statically coded but can be easily fetched from a config file if needed.
*/

//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
//SECURITY CODE LEVEL : LOW (Read-Only Informational Component)
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Import the SideBar component
import logo from '../components/assets/setVlogo.png' // Import the logo
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons from React Icons

const FAQ = ({logoutFunction}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is a pregnancy tracker?',
      answer: 'A pregnancy tracker helps you monitor your pregnancy week-by-week, providing updates on your baby’s development and your body’s changes.'
    },
    {
      question: 'How accurate is a pregnancy tracker?',
      answer: 'Pregnancy trackers are generally accurate based on standard development milestones, but individual experiences may vary. Always consult your healthcare provider.'
    },
    {
      question: 'Can I track my baby’s growth with this app?',
      answer: 'Yes, the app provides updates on your baby’s growth and what to expect each week.'
    },
    {
      question: 'Is the pregnancy tracker free to use?',
      answer: 'Yes, our basic pregnancy tracker features are free to use. Some advanced features may require a subscription.'
    },
    {
      question: 'Can I get reminders for doctor appointments?',
      answer: 'Yes, you can set up reminders for appointments, vitamins, and other important tasks.'
    }
  ];

  const navigate = useNavigate();

  return (
    <>
    <nav className='h-16 w-full bg-gray-900  fixed top-0 z-20'>
      <img
        src={logo}
        alt="Logo"
        className="absolute top-0 right-4 w-20 h-20 sm:w-32 mt-2 sm:h-20 object-contain"
      />

      {/* Sidebar */}
      <SideBar
        logoutFunction={logoutFunction}
        className="lg:static lg:flex-shrink-0"
      />
      </nav>
    <div className="bg-gray-900  text-white h-screen relative">
      {/* Logo */}
      

      {/* Main Layout */}
      <div className="flex h-full">
        {/* Sidebar */}
     

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto ml-20 mt-10">
          {/* Header */}
          <div className="mb-6 mt-5">
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          </div>
          <div className="border-b border-gray-600 mb-4"></div>

          {/* FAQ Section */}
          <div className="max-w-5xl mx-auto p-6 bg-gray-700 rounded-lg shadow-md">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-600 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-4 flex justify-between items-center bg-gray-600 text-white focus:outline-none"
                  >
                    {faq.question}
                    <span>{openIndex === index ? '-' : '+'}</span>
                  </button>
                  {openIndex === index && (
                    <div className="p-4 bg-gray-800 text-gray-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg">
                If you have any further questions or need assistance, please feel free to contact us:
              </p>
              <ul className="space-y-4">
                {/* Email */}
                <li className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-300">Email</p>
                    <a
                      href="mailto:Setv@gmail.com"
                      className="text-orange-400 hover:text-orange-300 text-lg"
                    >
                      Setv@gmail.com
                    </a>
                  </div>
                </li>

                {/* Phone */}
                <li className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-300">Phone</p>
                    <a
                      href="tel:+1234567890"
                      className="text-orange-400 hover:text-orange-300 text-lg"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </li>

                {/* Address */}
                <li className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-300">Address</p>
                    <p className="text-orange-300 text-lg">
                      123 Pregnancy Lane, Motherhood City, USA
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default FAQ;