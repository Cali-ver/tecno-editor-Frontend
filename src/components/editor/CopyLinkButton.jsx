import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';

/**
 * CopyLinkButton - A premium button component for copying the design share link.
 * 
 * @param {Object} props
 * @param {string} props.designId - The ID of the current design
 * @param {Function} props.onBeforeCopy - Optional callback to handle saving before copy
 */
const CopyLinkButton = ({ designId, onBeforeCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // If a callback is provided (e.g. to save the design first), call it
    let currentId = designId;
    if (onBeforeCopy) {
      const result = await onBeforeCopy();
      if (result) currentId = result;
    }

    if (!currentId) return;
    
    const shareUrl = `${window.location.origin}/editor?id=${currentId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Feedback duration: 2 seconds as requested
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <button
      id="copy-link-button"
      onClick={handleCopy}
      className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg ${
        copied 
          ? 'bg-emerald-500 text-white shadow-emerald-200' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
      }`}
    >
      {copied ? (
        <>
          <Check className="w-5 h-5 animate-in zoom-in duration-300" />
          <span className="animate-in fade-in slide-in-from-bottom-1">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="w-5 h-5 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
          <span>Copy link</span>
        </>
      )}
    </button>
  );
};

export default CopyLinkButton;
