import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

export const CrossBattleCopySeedButton = ({letters=""}) => {
    const [copied, setCopied] = useState(false);
  
    // Function to copy the link to clipboard
    const copyToClipboard = () => {
      navigator.clipboard.writeText(letters)
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
          className={`px-1 py-1 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-xs`}
        >
          <div className="flex gap-1 items-center">
            {copied ? <FaCheck className="text-green-600"/> : <IoCopyOutline />}
            {copied ? 'Seed Copied!' : 'Copy Seed'}
          </div>
        </button>
      </div>
    );
  };