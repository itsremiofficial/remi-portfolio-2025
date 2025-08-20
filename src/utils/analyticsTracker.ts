interface ThemeChangeEvent {
  previousTheme: string;
  newTheme: string;
  timestamp: number;
  sessionId: string;
}

const themeChangeEvents: ThemeChangeEvent[] = [];
const sessionId = `session_${Math.random().toString(36).substring(2, 9)}`;

export const trackThemeChange = (
  previousTheme: string,
  newTheme: string
): void => {
  const event: ThemeChangeEvent = {
    previousTheme,
    newTheme,
    timestamp: Date.now(),
    sessionId,
  };

  themeChangeEvents.push(event);

  // In a real app, you might send this to an analytics service
  console.log("Theme change tracked:", event);

  // For demo purposes, we'll just store it locally
  localStorage.setItem("themeChangeEvents", JSON.stringify(themeChangeEvents));
};

export const getThemeChangeStats = () => {
  const events = themeChangeEvents;

  return {
    totalChanges: events.length,
    mostFrequentTheme: getMostFrequent(events.map((e) => e.newTheme)),
    averageDuration: getAverageDuration(events),
    sessionId,
  };
};

const getMostFrequent = (arr: string[]): string => {
  const counts = arr.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
};

const getAverageDuration = (events: ThemeChangeEvent[]): number => {
  if (events.length <= 1) return 0;

  let totalDuration = 0;
  for (let i = 1; i < events.length; i++) {
    totalDuration += events[i].timestamp - events[i - 1].timestamp;
  }

  return Math.floor(totalDuration / (events.length - 1));
};
