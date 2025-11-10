import { Mail, Github, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          Get In Touch 📧
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have questions, feedback, or need support.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-1 space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b pb-3 mb-4">
            Our Details
          </h2>
          
          {/* Email Support */}
          <ContactDetail 
            icon={<Mail className="w-5 h-5 text-green-600" />}
            title="Email Support"
            value="errandx.support@gmail.com"
            link="mailto:errandx.support@gmail.com"
          />

          {/* Development Repository */}
          <ContactDetail 
            icon={<Github className="w-5 h-5 text-gray-900 dark:text-gray-100" />} 
            title="Development Repository"
            value="github.com/ErrandX-Dev"
            link="https://github.com/ErrandX-Dev" // Placeholder link
          />

          {/* Campus Location */}
          <ContactDetail 
            icon={<MapPin className="w-5 h-5 text-red-600" />}
            title="Campus Location"
            value="Campus Innovation Center, Block C"
          />

          {/* Support Line */}
          <ContactDetail 
            icon={<Phone className="w-5 h-5 text-blue-600" />}
            title="Support Line (Text Only)"
            value="+1 (555) 123-4567"
          />

        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-2 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-green-300/50 dark:border-green-700/50">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Send us a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Campus Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="user@campus.edu"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Tell us how we can help..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full justify-center inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition duration-150"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Utility component for cleaner layout
function ContactDetail({ icon, title, value, link }) {
    const content = (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</p>
                <p className="text-md text-gray-900 dark:text-gray-100 font-medium">{value}</p>
            </div>
        </div>
    );

    return link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition block">
            {content}
        </a>
    ) : (
        <div className="p-2 -m-2">
            {content}
        </div>
    );
}