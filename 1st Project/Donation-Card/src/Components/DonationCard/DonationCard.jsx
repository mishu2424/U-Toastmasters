/*
 * Task 2 – Donation Card with Progress | Volunteer: Apurbo Dey Mishu
 * 
 * README:
 * - How to change goal/raised values: Update the `raised` and `goal` props when using <DonationCard />.
 * - How to update the CTA link: Change the `ctaHref` prop to your actual CanadaHelps URL.
 * - All text strings are fully configurable via props (title, subtitle, missionHeading, missionBody, ctaText, progressHeading).
 * - Theme assumption: Uses YRES brand teal (#3D96AB) for primary actions and progress bar.
 * - Requires Tailwind CSS and daisyUI configured in your project.
 * - Progress bar handles edge cases: if goal=0, shows 0%; if raised>goal, caps visual at 100% but shows true figures.
 * - The progress caption uses aria-live="polite" to announce updates to screen readers.
 */

import React from 'react';

// YRES Brand Colors
const YRES_TEAL = '#3D96AB';
const YRES_TEAL_HOVER = '#2d7a8f';
const YRES_TEAL_FOCUS = '#6bb3c4';

const DonationCard = ({
  // Content props - all editable
  title = "Donate",
  subtitle = "Make an Impact with YRES",
  missionHeading = "Our Mission",
  missionBody = [
    "Our mission at York Region Educational Services is to provide accessible and high-quality learning opportunities for the York Region community.",
    "To cut current program costs, improve quality, and commence new initiatives, our goal is to raise $15,000 CAD."
  ],
  progressHeading = "We've Raised…",
  ctaText = "Donate Now",
  
  // Functional props
  raised = 2500,
  goal = 15000,
  ctaHref = "https://www.canadahelps.org/en/", // Replace with actual YRES CanadaHelps URL
}) => {
  // Edge case handling: prevent divide-by-zero
  const safeGoal = goal > 0 ? goal : 1;
  const actualPercentage = (raised / safeGoal) * 100;
  
  // Cap visual percentage at 100%, but keep true figures for display
  const visualPercentage = Math.min(actualPercentage, 100);
  
  // If goal is 0, default to 0%
  const displayPercentage = goal > 0 ? Math.round(actualPercentage) : 0;

  // Canadian currency formatter
  const formatCAD = (amount) => {
    return amount.toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formattedRaised = formatCAD(raised);
  const formattedGoal = formatCAD(goal);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
      
      {/* Title + Subtitle Section - Centered */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Primary CTA Button */}
      <div className="flex justify-center min-h-[3.5rem]">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full sm:w-auto px-8 py-3 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-4 active:scale-95 text-center"
          style={{
            backgroundColor: YRES_TEAL,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = YRES_TEAL_HOVER}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = YRES_TEAL}
          onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 4px ${YRES_TEAL_FOCUS}`}
          onBlur={(e) => e.currentTarget.style.boxShadow = ''}
          aria-label="Donate now via CanadaHelps (opens in new tab)"
        >
          {ctaText}
        </a>
      </div>

      {/* Mission Heading + Mission Text */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          {missionHeading}
        </h3>
        <div className="space-y-3 text-gray-700 leading-relaxed">
          {Array.isArray(missionBody) ? (
            missionBody.map((paragraph, index) => (
              <p key={index} className="text-sm sm:text-base">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-sm sm:text-base">{missionBody}</p>
          )}
        </div>
      </div>

      {/* Progress Heading + Bar + Caption */}
      <div className="space-y-3 pt-2">
        <h4 className="text-lg sm:text-xl font-bold text-gray-900">
          {progressHeading}
        </h4>
        
        {/* Progress Bar Container */}
        <div className="space-y-2 min-h-[4rem]">
          <div 
            className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner"
            role="progressbar"
            aria-valuenow={Math.min(displayPercentage, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Fundraising progress: ${Math.min(displayPercentage, 100)} percent complete`}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-1"
              style={{ 
                width: `${visualPercentage}%`,
                backgroundColor: YRES_TEAL
              }}
            >
              {visualPercentage > 15 && (
                <span className="text-xs font-bold text-white">
                  {Math.min(displayPercentage, 100)}%
                </span>
              )}
            </div>
          </div>
          
          {/* Progress Caption - Polite live region */}
          <p 
            className="text-sm sm:text-base text-gray-700 font-medium text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="font-bold text-gray-900">{formattedRaised}</span>
            {' / '}
            <span className="font-bold text-gray-900">{formattedGoal}</span>
            <span className="block sm:inline sm:ml-1 text-gray-600">
              Help us meet our goal!
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default DonationCard;