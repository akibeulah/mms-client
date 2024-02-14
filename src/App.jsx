import axios from "axios"
import { useState } from 'react'
import './App.css'
import querystring from "querystring"

function App() {
  const [isHeroOpen, setIsHeroOpen] = useState(true);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    host: "imap.gmail.com",
    count: 1
  })
  const [mails, setMails] = useState([])

  const toggleHeroSection = () => {
    setIsHeroOpen(!isHeroOpen);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-800 text-white font-sans">
        {/* Header */}
        <header className="bg-gray-900 p-4">
          <h1 className="text-2xl font-bold">Malware Mail Scanner</h1>
        </header>

        {/* Hero Section */}
        <div className="bg-gray-700">
          <button
            className="w-full mb-4 flex p-2 bg-gray-800 hover:bg-gray-600 focus:outline-none"
            onClick={toggleHeroSection}
          >
            <span className={`block mx-auto transition transform duration-300 ${isHeroOpen ? "" : "rotate-180"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>

          {/* Collapsible Hero Section */}
          {isHeroOpen && (
            <div className="bg-gray-800 p-4 shadow-md">
              <form onSubmit={e => {
                e.preventDefault()
                setLoading(true)

                axios.post(
                  "https://mms-server-vt40.onrender.com/fetch-emails",
                  formData,
                  {
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }
                  }
                )
                  .then(res => {
                    console.log(res.data.mails[0])
                    setMails(res.data.mails)
                  })
                  .finally(() => {
                    setLoading(false)
                  })
              }}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-md bg-gray-900 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded-md bg-gray-900 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="host" className="block text-sm font-medium">
                      Host
                    </label>
                    <input
                      type="text"
                      id="host"
                      name="host"
                      value={formData.host}
                      onChange={e => setFormData({ ...formData, host: e.target.value })}
                      className="w-full p-2 border rounded-md bg-gray-900 text-white"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="host" className="block text-sm font-medium">
                      Count
                    </label>
                    <input
                      type="number"
                      id="count"
                      name="count"
                      value={formData.count}
                      onChange={e => setFormData({ ...formData, count: e.target.value })}
                      className="w-full p-2 border rounded-md bg-gray-900 text-white"
                    />
                  </div>
                </div>

                <div className="text-red-600 text-right font-light text-sm mb-4">
                  *You have to have enabled IMAP on your email and created an app password to use this tool
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md"
                  >
                    {loading ?
                      <span className="animate-spin block flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </span>
                      :
                      "Login"
                    }
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setMails([])
                    }}
                    className="w-full p-2 bg-blue-500 hover:bg-blue-400 text-white rounded-md">
                    Clear
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Mails */}
        <div className="p-4 space-y-2">
          <div className="border border-gray-200 p-2">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                Date
              </div>
              <div className="col-span-4">
                From
              </div>
              <div className="col-span-5">
                Subject
              </div>
              <div>
                Spam | Dirty Links
              </div>
            </div>
          </div>

          {
            mails.map((m, k) =>
              <span key={k}>
                <EmailDetails emailData={m} />
              </span>
            )
          }
        </div>

      </div>
    </>
  )
}

export default App

const EmailDetails = ({ emailData }) => {
  const { headers, date, body, spamResult, dirtyLinks } = emailData;

  return (
    <div className="border border-gray-200 p-2">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          {date}
        </div>
        <div className="col-span-4">
          <strong></strong> {headers.from && headers.from[0]}
        </div>
        <div className="col-span-5">
          <strong></strong> {headers.subject && headers.subject[0]}
        </div>
        <div className="flex flex-row">
          {spamResult.is_spam ?
            <span className="text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </span>
            :
            <span className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
          }

          {dirtyLinks ?
            <span className="text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </span>
            :
            <span className="text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
          }
        </div>
      </div>
    </div>
  );
};
