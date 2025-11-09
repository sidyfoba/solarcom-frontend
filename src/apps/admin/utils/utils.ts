// utils.ts

export const calculateDuration = (
  startDateTime: string | undefined,
  endDateTime: string | undefined
): string => {
  if (startDateTime && endDateTime) {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    console.log("start time  = " + startDate);
    console.log("end time  = " + endDate);
    // Check if both dates are valid
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      const diffInMs = endDate.getTime() - startDate.getTime();

      // Calculate the duration in seconds, minutes, hours, and days
      const seconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Format the duration string
      const duration = `${days}d ${hours % 24}h ${minutes % 60}m`;

      return duration;
    }
  }
  return "";
};

// utils.ts

export const calculateDurationFromNow = (
  startDateTime: string | undefined
): string => {
  if (startDateTime) {
    const startDate = new Date(startDateTime);
    const now = new Date();

    // Check if the start date is valid
    if (!isNaN(startDate.getTime())) {
      const diffInMs = now.getTime() - startDate.getTime(); // Difference in milliseconds

      // Calculate the duration in seconds, minutes, hours, and days
      const seconds = Math.floor(diffInMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Format the duration string
      const duration = `${days}d ${hours % 24}h ${minutes % 60}m`;

      return duration;
    }
  }
  return "";
};
