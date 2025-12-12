import { cn } from "@/lib/utils";
import React from "react";

export const RisingBall = () => {
    return (
        <div className="loader relative w-[120px] h-[90px] mx-auto">
            <style jsx>{`
        .loader:after {
          content: "";
          position: absolute;
          bottom: 30px;
          left: 0;
          width: 20px;
          height: 20px;
          background: #00FF9D;
          border-radius: 50%;
          animation: loading-bounce 0.5s cubic-bezier(0.19, 0.57, 0.3, 0.98) infinite alternate;
        }
        .loader:before {
          content: "";
          position: absolute;
          bottom: 28px;
          left: 0;
          width: 15px;
          height: 15px;
          background: rgba(0, 0, 0, 0);
          border-radius: 50%;
          animation: loading-step 1s cubic-bezier(0.19, 0.57, 0.3, 0.98) infinite;
        }
      `}</style>
        </div>
    );
};
