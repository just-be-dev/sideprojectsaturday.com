import { getEventEndTime, getEventStartTime } from "@/lib/date-utils";

/**
 * Generate calendar event data for Side Project Saturday
 */
export function generateCalendarEvent(eventDate: Date) {
	const startTime = getEventStartTime(eventDate);
	const endTime = getEventEndTime(eventDate);

	const formatDateTime = (date: Date) => `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

	const title = "Side Project Saturday";
	const description =
		"Join fellow builders and creators for a Saturday morning of focused work, collaboration, and community in Brooklyn. Bring your laptop, current project, and good vibes!";
	const location = "325 Gold Street, Brooklyn, NY 11201 (5th Floor)";

	// Generate calendar data
	const calendarData = {
		description,
		endTime: formatDateTime(endTime),
		location,
		startTime: formatDateTime(startTime),
		startTimeFormatted: startTime.toLocaleString("en-US", {
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
			month: "long",
			timeZone: "America/New_York",
			timeZoneName: "short",
			weekday: "long",
			year: "numeric",
		}),
		title,
	};

	// Generate Google Calendar URL
	const googleParams = new URLSearchParams({
		action: "TEMPLATE",
		dates: `${calendarData.startTime}/${calendarData.endTime}`,
		details: description,
		location: location,
		sprop: "website:sideprojectsaturday.com",
		text: title,
		trp: "false",
	});

	const googleCalendarUrl = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

	// Generate ICS file content
	const icsContent = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Side Project Saturday//Event//EN",
		"BEGIN:VEVENT",
		`UID:sps-${startTime.getTime()}@sideprojectsaturday.com`,
		`DTSTART:${calendarData.startTime}`,
		`DTEND:${calendarData.endTime}`,
		`SUMMARY:${title}`,
		`DESCRIPTION:${description.replace(/,/g, "\\,")}`,
		`LOCATION:${location.replace(/,/g, "\\,")}`,
		`STATUS:CONFIRMED`,
		`BEGIN:VALARM`,
		`TRIGGER:-PT1H`,
		`ACTION:DISPLAY`,
		`DESCRIPTION:Reminder: Side Project Saturday starts in 1 hour`,
		`END:VALARM`,
		"END:VEVENT",
		"END:VCALENDAR",
	].join("\r\n");

	return {
		...calendarData,
		googleCalendarUrl,
		icsContent,
	};
}
