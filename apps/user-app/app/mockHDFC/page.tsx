"use client";
import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';

export default function NetBankingLogin() {

async function addMoneyOnClick(event:any) {
  event.preventDefault();

  try {
    axios.post('/api/mockHDFC');
  } catch (error) {
    console.error("Error sending amount while adding money:", error);
  }
  window.location.href = '/home';
}


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>HDFC Bank NetBanking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Welcome to HDFC Bank NetBanking
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Login Section */}
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Login to NetBanking</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID/ User ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Customer ID"
                  />
                  <a href="#" className="text-blue-600 text-sm hover:underline mt-1 block">
                    Forgot Customer ID
                  </a>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Password"
                  />
                </div>
                
                <button
                  type="submit"
                  onClick={addMoneyOnClick}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  CONTINUE
                </button>
              </form>
              
              <div className="mt-6 text-gray-600">
                <p>Dear Customer,</p>
                <p className="mt-2">
                  Welcome to the new login page of HDFC Bank NetBanking.
                  Its lighter look and feel is designed to give you the best possible
                  user experience. Please continue to login using your customer ID
                  and password.
                </p>
              </div>
              
            </div>
            
            {/* Info Section */}
            <div className="md:w-1/2 space-y-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your security is of utmost importance.
                      <a href="#" className="text-blue-600 hover:underline ml-1">
                        Know More...
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">First Time User?</h3>
                <button className="bg-white border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
                  Register Now
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  for a host of convenient features
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">
                  We have added a host of new features!
                </h3>
                <p className="text-gray-600 mb-2">
                  You can now do so much more:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Anywhere access through Desktop or mobile</li>
                  <li>Enhanced security measures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © HDFC Bank Ltd. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}