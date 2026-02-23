/**
 * Date utilities for Side Project Saturday
 */

/**
 * Get the next Saturday as a Date object (at midnight)
 */
export function getNextSaturdayDate(): Date {
	const now = new Date();
	const daysUntilSaturday = (6 - now.getDay()) % 7 || 7;
	const nextSaturday = new Date(now);
	nextSaturday.setDate(now.getDate() + daysUntilSaturday);
	nextSaturday.setHours(0, 0, 0, 0);
	return nextSaturday;
}

/**
 * Get the current week's Saturday date (at midnight)
 * If today is Saturday, returns today. Otherwise returns the coming Saturday.
 */
export function getCurrentWeekSaturdayDate(): Date {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
	const currentWeekSaturday = new Date(today);
	currentWeekSaturday.setDate(today.getDate() + daysUntilSaturday);
	currentWeekSaturday.setHours(0, 0, 0, 0);
	return currentWeekSaturday;
}

/**
 * Get the next Saturday as a formatted string
 */
export function getNextSaturdayFormatted(): string {
	const nextSaturday = getNextSaturdayDate();
	return nextSaturday.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		weekday: "long",
		year: "numeric",
	});
}

/**
 * Format a date for display
 */
export function formatEventDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		weekday: "long",
		year: "numeric",
	});
}

/**
 * Get the Wednesday before a given Saturday event date
 */
export function getWednesdayBeforeEvent(eventDate: Date): Date {
	const wednesday = new Date(eventDate);
	wednesday.setDate(wednesday.getDate() - 3);
	wednesday.setHours(12, 0, 0, 0); // 12 PM Wednesday
	return wednesday;
}

/**
 * Get the morning of a Saturday event (7 AM)
 */
export function getSaturdayMorning(eventDate: Date): Date {
	const saturdayMorning = new Date(eventDate);
	saturdayMorning.setHours(7, 0, 0, 0); // 7 AM Saturday
	return saturdayMorning;
}

/**
 * Calculate delay in milliseconds from now to a target date
 */
export function getDelayUntil(targetDate: Date): number {
	const now = new Date();
	return Math.max(0, targetDate.getTime() - now.getTime());
}

/**
 * Get event start time (9 AM) for a given date
 */
export function getEventStartTime(eventDate: Date): Date {
	const startTime = new Date(eventDate);
	startTime.setHours(9, 0, 0, 0);
	return startTime;
}

/**
 * Get event end time (12 PM) for a given date
 */
export function getEventEndTime(eventDate: Date): Date {
	const endTime = new Date(eventDate);
	endTime.setHours(12, 0, 0, 0);
	return endTime;
}

/**
 * Check if a date is a Saturday
 */
export function isSaturday(date: Date): boolean {
	return date.getDay() === 6;
}

/**
 * Get the date range for querying events on a specific day
 */
export function getDayRange(date: Date): { start: Date; end: Date } {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);

	const end = new Date(start);
	end.setDate(end.getDate() + 1);

	return { end, start };
}

/**
 * Check if current time is within Saturday event hours (9am-12pm EST/EDT)
 */
export function isWithinEventHours(date: Date = new Date()): boolean {
	const nyTime = new Date(
		date.toLocaleString("en-US", { timeZone: "America/New_York" }),
	);
	const day = nyTime.getDay();
	const hours = nyTime.getHours();

	// Saturday is day 6
	// Check if it's Saturday and between 9am-12pm EST/EDT
	return day === 6 && hours >= 9 && hours < 12;
}

/**
 * Check if we're still within the current event window for RSVP purposes
 * Returns true if it's before Saturday noon EST/EDT, false after noon on Saturday
 */
export function isBeforeEventEnd(date: Date = new Date()): boolean {
	const nyTime = new Date(
		date.toLocaleString("en-US", { timeZone: "America/New_York" }),
	);
	const day = nyTime.getDay();
	const hours = nyTime.getHours();

	// If it's not Saturday, we're always before the current event end
	if (day !== 6) {
		return true;
	}

	// If it's Saturday, check if we're before noon (12 PM)
	return hours < 12;
}

/**
 * Check if we can still RSVP for current event (at least 1 hour before end)
 * Returns true if it's at least 1 hour before Saturday noon EST/EDT
 */
export function canRsvpForCurrentEvent(date: Date = new Date()): boolean {
	const nyTime = new Date(
		date.toLocaleString("en-US", { timeZone: "America/New_York" }),
	);
	const day = nyTime.getDay();
	const hours = nyTime.getHours();

	// If it's not Saturday, we can still RSVP for current event
	if (day !== 6) {
		return true;
	}

	// If it's Saturday, check if we're at least 1 hour before noon (11 AM)
	return hours < 11;
}

/**
 * Get the appropriate event cutoff date for RSVP queries
 * Before Saturday noon: allows RSVPs for current week's event (if it exists)
 * After Saturday noon: only allows RSVPs for next week's event
 */
export function getRsvpEventCutoff(date: Date = new Date()): Date {
	if (isBeforeEventEnd(date)) {
		// Before Saturday noon - allow current week's event
		// Use a date from the past week to include today's event if it exists
		const cutoff = new Date(date);
		cutoff.setDate(date.getDate() - 7); // 7 days ago
		cutoff.setHours(0, 0, 0, 0);
		return cutoff;
	} else {
		// After Saturday noon - only next week's events
		return new Date(date);
	}
}
