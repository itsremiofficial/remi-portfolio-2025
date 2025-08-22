import React, { useState, useEffect } from "react";

interface TimeDisplayProps {
  mode?: "single" | "dual"; // Single time or dual time display
  timeType?: "time" | "date" | "both"; // What to display
  length?: "short" | "medium" | "long"; // Format length
  timezone?: string; // Custom timezone (for single mode)
  separator?: string; // Separator for dual mode
  className?: string; // Custom CSS classes
  childClass?: string; // Custom CSS classes
  separatorClass?: string; // Custom CSS classes
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  mode = "dual",
  timeType = "both",
  length = "medium",
  timezone,
  separator = "",
  className = "",
  childClass = "",
  separatorClass = "",
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [visitorTimeZone, setVisitorTimeZone] = useState<string>("UTC");

  useEffect(() => {
    // Detect visitor's timezone with fallback
    try {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setVisitorTimeZone(detectedTimeZone || "UTC");
    } catch (error) {
      setVisitorTimeZone("UTC");
    }

    // Set up timer for real-time updates
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timeZone,
      hour12: true,
    };

    switch (length) {
      case "short":
        options.hour = "2-digit";
        options.minute = "2-digit";
        break;
      case "medium":
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
        break;
      case "long":
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
        options.timeZoneName = "short";
        break;
    }

    return date.toLocaleTimeString("en-US", options);
  };

  const formatDate = (date: Date, timeZone: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timeZone,
    };

    switch (length) {
      case "short":
        options.month = "numeric";
        options.day = "numeric";
        options.year = "2-digit";
        break;
      case "medium":
        options.month = "short";
        options.day = "numeric";
        options.year = "numeric";
        break;
      case "long":
        options.weekday = "long";
        options.month = "long";
        options.day = "numeric";
        options.year = "numeric";
        break;
    }

    return date.toLocaleDateString("en-US", options);
  };

  const formatDateTime = (date: Date, timeZone: string): string => {
    if (timeType === "time") {
      return formatTime(date, timeZone);
    } else if (timeType === "date") {
      return formatDate(date, timeZone);
    } else {
      // both
      const timeStr = formatTime(date, timeZone);
      const dateStr = formatDate(date, timeZone);

      if (length === "short") {
        return `${timeStr} ${dateStr}`;
      } else {
        return `${dateStr} ${timeStr}`;
      }
    }
  };

  const getTimeZoneLabel = (tz: string): string => {
    if (tz === "Asia/Karachi") return "PKT";
    if (tz === "UTC") return "UTC";

    // Extract timezone abbreviation or use the timezone name
    const parts = tz.split("/");
    return parts[parts.length - 1].replace(/_/g, " ");
  };

  // Pakistan timezone
  const pakistanTimeZone = "Asia/Karachi";

  // Determine which timezone to use for single mode
  const singleTimeZone = timezone || pakistanTimeZone;

  if (mode === "single") {
    const timeDisplay = formatDateTime(currentTime, singleTimeZone);
    const label =
      length === "long" ? ` (${getTimeZoneLabel(singleTimeZone)})` : "";

    return (
      <span className={className}>
        {timeDisplay}
        {label}
      </span>
    );
  }

  // Dual mode
  const pakistanTime = formatDateTime(currentTime, pakistanTimeZone);
  const visitorTime = formatDateTime(currentTime, visitorTimeZone);

  const pakistanLabel =
    length === "long" ? ` (${getTimeZoneLabel(pakistanTimeZone)})` : "";
  const visitorLabel =
    length === "long" ? ` (${getTimeZoneLabel(visitorTimeZone)})` : "";

  return (
    <span className={className}>
      <div className={childClass}>
        {pakistanTime}
        {pakistanLabel}
      </div>
      <span className={separatorClass}>{separator}</span>
      <div className={childClass}>
        {visitorTime}
        {visitorLabel}
      </div>
    </span>
  );
};
export default TimeDisplay;
