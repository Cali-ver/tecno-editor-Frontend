import React, { useState, useEffect } from 'react';
import { X, Smartphone, QrCode, Send, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { designAPI } from '../api/client';

const SendToPhoneModal = ({ designId, shareUrl, onClose }) => {
  const [activeTab, setActiveTab] = useState('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (shareUrl) {
      // Use high-reliability external QR API as a fallback for local library issues
      const apiUri = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`;
      setQrCodeUrl(apiUri);
    }
  }, [shareUrl]);

  const handleSendSms = async () => {
    if (!phoneNumber) return;
    setIsSending(true);
    try {
      const message = `Check out my design on CanvaClone: ${shareUrl}`;
      await designAPI.sendToPhone(phoneNumber, message);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    } catch (err) {
      console.error("SMS Error", err);
      alert("Failed to send SMS. Please check your Twilio configuration.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setIsSending(true);
    try {
      const message = `Check out my design on CanvaClone: ${shareUrl}`;
      await designAPI.sendEmail(email, message);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 3000);
    } catch (err) {
      console.error("Email Error", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-[450px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Send to others</h2>
            <p className="text-sm text-gray-500 font-medium">Choose how you want to receive your design</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-8 flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('sms')}
            className={`flex items-center gap-2 py-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'sms' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Smartphone className="w-4 h-4" /> SMS Link
            {activeTab === 'sms' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2 py-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'qr' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <QrCode className="w-4 h-4" /> QR Code
            {activeTab === 'qr' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 py-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'email' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Mail className="w-4 h-4" /> By Email
            {activeTab === 'email' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'sms' && (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                  />
                  <Smartphone className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                </div>
              </div>

              <button 
                onClick={handleSendSms}
                disabled={isSending || isSent || !phoneNumber}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                  isSent ? 'bg-green-500 text-white shadow-green-100' : 
                  isSending ? 'bg-purple-100 text-purple-400 cursor-not-allowed' :
                  'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'
                }`}
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Sent!
                  </>
                ) : isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Link via SMS
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                By sending, you agree to receive an automated SMS with your design link. Standard data and message rates may apply.
              </p>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all"
                  />
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-purple-500 transition-colors" />
                </div>
              </div>

              <button 
                onClick={handleSendEmail}
                disabled={isSending || isSent || !email}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                  isSent ? 'bg-green-500 text-white shadow-green-100' : 
                  isSending ? 'bg-purple-100 text-purple-400 cursor-not-allowed' :
                  'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'
                }`}
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Sent!
                  </>
                ) : isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Link via Email
                  </>
                )}
              </button>
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                Your design link will be sent to the email address provided.
              </p>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 bg-white border-4 border-purple-50 rounded-[32px] shadow-sm mb-6">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Design QR Code" className="w-48 h-48 rounded-xl" />
                ) : (
                  <div className="w-48 h-48 bg-gray-50 flex items-center justify-center rounded-xl animate-pulse">
                    <QrCode className="w-12 h-12 text-gray-200" />
                  </div>
                )}
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-gray-900">Scan to open on your phone</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-[280px]">
                  Open your camera app and point it at the code to view your design on mobile.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
          <button onClick={onClose} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendToPhoneModal;
