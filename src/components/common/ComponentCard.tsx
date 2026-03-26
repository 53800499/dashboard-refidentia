import { CirclePlus, SquareArrowRightExit } from "lucide-react";
import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  button?: {
    text: string;
    onClick: () => void;
  };
  filters?: React.ReactNode; // Nouvelle prop pour filtres
  exportBtn?: {
    text: string;
    onClick: () => void;
  }; // Nouvelle prop pour le bouton d'export
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  button,
  filters,
  exportBtn,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
          {filters && <>{filters}</>}
          {exportBtn && (
            <div className="mt-2 md:mt-0">
              <button
                onClick={exportBtn.onClick}
                className="inline-flex items-center justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              ><SquareArrowRightExit className="w-4 h-4 mr-2" />
                {exportBtn.text}
              </button>
            </div>
          )}
          {button && (
            <div className="mt-2 md:mt-0">
              <button
                onClick={button.onClick}
                className="inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              ><CirclePlus className="w-4 h-4 mr-2"/>{button.text}
              </button>
            </div>
          )}
          
        </div>

      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;