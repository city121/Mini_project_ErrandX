import { Zap } from "lucide-react";

export default function CreatorBadge() {
  return (
    // Fixed positioning for bottom-right corner
    <div className="fixed bottom-6 right-6 z-50"> 
      <div 
        className="
          bg-white dark:bg-gray-800 
          p-4 
          rounded-xl 
          shadow-2xl 
          border border-green-500/50 dark:border-green-400/50
          transform transition-all duration-300 hover:scale-[1.03] hover:shadow-green-500/40
        "
      >
        <div className="flex items-center space-x-2 mb-1">
          <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            A Campus Innovation Project
          </h3>
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-none mb-1">
          Created By:
        </p>
        
        {/* Updated List Display with 4 names */}
        <ol className="text-sm font-extrabold text-green-700 dark:text-green-300 leading-tight list-inside list-decimal pl-3 space-y-0">
          
                  <>Praveen Suthar</>
              {/* 🆕 Added name */}
        </ol>

      </div>
    </div>
  );
}