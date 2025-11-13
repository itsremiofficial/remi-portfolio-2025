/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { SlidingNumber } from "./ui/SlidingNumber";

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
    try {
      const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setVisitorTimeZone(detectedTimeZone || "UTC");
    } catch {
      setVisitorTimeZone("UTC");
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // === Utility functions ===
  const getTimeParts = (date: Date, tz: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const parts = new Intl.DateTimeFormat("en-US", options)
      .formatToParts(date)
      .reduce((acc: any, part) => {
        if (part.type !== "literal") acc[part.type] = part.value;
        return acc;
      }, {});

    return {
      hours: parseInt(parts.hour),
      minutes: parseInt(parts.minute),
      seconds: parseInt(parts.second),
      ampm: parts.dayPeriod,
    };
  };

  const getTimeZoneLabel = (tz: string): string => {
    if (tz === "Asia/Karachi") return "PKT";
    if (tz === "UTC") return "UTC";
    const parts = tz.split("/");
    return parts[parts.length - 1].replace(/_/g, " ");
  };

  const pakistanTZ = "Asia/Karachi";
  const singleTZ = timezone || pakistanTZ;

  // === Single Mode ===
  if (mode === "single") {
    if (timeType === "time" || timeType === "both") {
      const { hours, minutes, seconds, ampm } = getTimeParts(
        currentTime,
        singleTZ
      );
      return (
        <div className={`flex items-center gap-1 font-mono ${className}`}>
          <SlidingNumber value={hours} padStart />
          <span>:</span>
          <SlidingNumber value={minutes} padStart />
          {length !== "short" && (
            <>
              <span className="">:</span>
              <SlidingNumber value={seconds} padStart />
            </>
          )}
          <span className="ml-1 ">{ampm}</span>
          {length === "long" && (
            <span className="ml-1">({getTimeZoneLabel(singleTZ)})</span>
          )}
        </div>
      );
    } else {
      // Date-only mode
      const dateStr = currentTime.toLocaleDateString("en-US", {
        timeZone: singleTZ,
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return <div className={className}>{dateStr}</div>;
    }
  }

  // === Dual Mode ===
  const pk = getTimeParts(currentTime, pakistanTZ);
  const visitor = getTimeParts(currentTime, visitorTimeZone);

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex items-center gap-1 font-mono ${childClass}`}>
        <SlidingNumber value={pk.hours} padStart />
        <span className="">:</span>
        <SlidingNumber value={pk.minutes} padStart />
        {length !== "short" && (
          <>
            <span className="">:</span>
            <SlidingNumber value={pk.seconds} padStart />
          </>
        )}
        <span className="ml-1 text-xs ">{pk.ampm}</span>
        {length === "long" && (
          <span className="ml-1 ">({getTimeZoneLabel(pakistanTZ)})</span>
        )}
      </div>

      <span className={separatorClass}>{separator}</span>

      <div className={`flex items-center gap-1 font-mono ${childClass}`}>
        <SlidingNumber value={visitor.hours} padStart />
        <span className="">:</span>
        <SlidingNumber value={visitor.minutes} padStart />
        {length !== "short" && (
          <>
            <span className="">:</span>
            <SlidingNumber value={visitor.seconds} padStart />
          </>
        )}
        <span className="ml-1 text-xs ">{visitor.ampm}</span>
        {length === "long" && (
          <span className="ml-1 ">({getTimeZoneLabel(visitorTimeZone)})</span>
        )}
      </div>
    </div>
  );
};

export default TimeDisplay;
