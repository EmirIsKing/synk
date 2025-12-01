'use client';

import { useState } from 'react';
import { Wifi, CheckCircle, AlertCircle } from 'lucide-react';

export default function SyncAttendance() {
  const [indexNumber, setIndexNumber] = useState('');
  const [name, setName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error' | 'closed'>('idle');

  const handleConnect = async () => {
    if (!indexNumber || !name) {
      setConnectionStatus('error');
      setTimeout(() => setConnectionStatus('idle'), 3000);
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');

    // Simulate WiFi verification and attendance registration
    // Replace this with your actual API call
    try {
      // API call:
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indexNumber, name}),
      });
      const data = await response.json();
      setIsConnecting(false);
      const { attendanceRegisteration } = data;

      setConnectionStatus(attendanceRegisteration);

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      setIsConnecting(false);
      setTimeout(() => setConnectionStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SYNK
          </h1>
          <p className="text-gray-600 text-lg">Attendance Management System</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200">
          {/* Connection Status Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <div className={`relative mb-5 transition-all duration-300 ${
                isConnecting ? 'scale-105' : 'scale-100'
              }`}>
                {connectionStatus === 'success' ? (
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-emerald-600" strokeWidth={2} />
                  </div>
                ) : connectionStatus === 'error' ? (
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-600" strokeWidth={2} />
                  </div>
                ): connectionStatus === 'closed' ? (
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-600" strokeWidth={2} />
                  </div>
                ) : (
                  <div className={`w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center ${
                    isConnecting ? 'animate-pulse' : ''
                  }`}>
                    <Wifi className="w-12 h-12 text-emerald-600" strokeWidth={2} />
                  </div>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center">
                {connectionStatus === 'success' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Registration Successful</h3>
                    <p className="text-gray-600">Your attendance has been recorded</p>
                  </>
                )}
                {connectionStatus === 'closed' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Registration Failed</h3>
                    <p className="text-red-600">Attendance is closed</p>
                  </>
                )}
                {connectionStatus === 'error' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Registration Failed</h3>
                    <p className="text-red-600">Please complete all required fields</p>
                  </>
                )}
                {connectionStatus === 'connecting' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Connecting...</h3>
                    <p className="text-gray-600">Verifying WiFi connection</p>
                  </>
                )}
                {connectionStatus === 'idle' && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">WiFi Registration</h3>
                    <p className="text-gray-600">Connect to register your attendance</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="space-y-6 mb-6">
              <div>
                <label htmlFor="indexNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                  Index Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="indexNumber"
                  type="text"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  disabled={isConnecting || connectionStatus === 'success'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                  placeholder="Enter your index number"
                />
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isConnecting || connectionStatus === 'success'}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <button
              onClick={handleConnect}
              disabled={isConnecting || connectionStatus === 'success'}
              className={`w-full py-3.5 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
                isConnecting || connectionStatus === 'success'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
              }`}
            >
              {isConnecting ? 'Connecting...' : 
               connectionStatus === 'success' ? 'Connected' : 
               'Register Attendance'}
            </button>
          </div>

          {/* Footer Info */}
          <div className="px-8 py-5 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-0.5">WiFi Connection Required</p>
                <p className="text-sm text-gray-600">Ensure you are connected to the venue&apos;s WiFi network before registering</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure attendance verification system
          </p>
        </div>
      </div>
    </div>
  );
}