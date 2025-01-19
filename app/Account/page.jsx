'use client'

import React from 'react'
import { RegisterLink, LoginLink } from '@kinde-oss/kinde-auth-nextjs'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Link from 'next/link'

export default function Page() {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient()

  return (
    <div className="relative min-h-screen">
      {/* Google Maps Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19868.687203718434!2d-0.1276473!3d51.5073509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1580000000000!5m2!1sen!2suk"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full min-h-screen bg-black/30">
        <nav className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="text-white text-2xl font-bold">
              Rapid GRID
            </div>

            {/* Auth Buttons */}
            <div className="space-x-4">
              {isLoading ? (
                <div className="animate-pulse bg-white/20 h-10 w-20 rounded-lg" />
              ) : !isAuthenticated ? (
                <div className="space-x-4">
                  <LoginLink>
                    <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      Sign In
                    </button>
                  </LoginLink>
                  <RegisterLink>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Sign Up
                    </button>
                  </RegisterLink>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="text-white">
                    <p className="font-medium">{user?.given_name} {user?.family_name}</p>
                    <p className="text-sm text-gray-300">{user?.email}</p>
                  </div>
                  <LoginLink>
                    <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                      Logout
                    </button>
                  </LoginLink>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto mt-32 px-6 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to Your App
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Your One-Stop Solution for Every Need, Even in Traffic – We've Got You Covered, Anytime, Anywhere.
          </p>

          {isAuthenticated &&
          <Link href={"/"}>
          <button className='bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-200 px-6 py-2 mt-8'>
            Get Started <i className="ri-arrow-right-up-line"></i>
          </button>
          </Link>
          }


          {!isAuthenticated && (
            <RegisterLink>
              <button className='bg-white text-black rounded-lg hover:bg-gray-100 transition-colors duration-200 px-6 py-2 mt-8'>
                SIGN UP FOR FREE
              </button>
            </RegisterLink>

          )}
        </div>
      </div>
    </div>
  )
}