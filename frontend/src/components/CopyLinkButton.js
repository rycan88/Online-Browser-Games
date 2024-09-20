import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

export const CopyLinkButton = () => {
    const [copied, setCopied] = useState(false);
  
    // Function to copy the link to clipboard
    const copyToClipboard = () => {
      const currentLink = window.location.href; // Get current page URL
  
      // Use clipboard API to copy text
      navigator.clipboard.writeText(currentLink)
        .then(() => {
          setCopied(true); // Set copied state to true
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    };
  
    return (
      <div className="flex flex-col items-center mt-10">
        <button
          onClick={copyToClipboard}
          className={`px-1 py-1 bg-slate-400 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors duration-300 text-xs`}
        >
          <div className="flex gap-1 items-center">
            {copied ? <FaCheck className="text-green-400"/> : <IoCopyOutline />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </div>
        </button>
      </div>
    );
  };