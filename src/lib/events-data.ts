export interface Event {
  id: number;
  title: string;
  body: string;
  image: string;
  date: string;
  time: string;
  location: string;
  host: string;
}

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Ramadan Iftar Night",
    body: "Join us for a community Iftar dinner to break fast together. All are welcome. Food will be provided — please RSVP so we can plan accordingly.",
    image: "/nueces.jpg",
    date: "2026-03-20",
    time: "18:30",
    location: "Banquet Hall",
    host: "Islamic Center",
  },
  {
    id: 2,
    title: "Tarawih Prayers",
    body: "Nightly Tarawih prayers will be led by Sheikh Ibrahim throughout the month of Ramadan. Doors open 15 minutes before prayer.",
    image: "/nueces.jpg",
    date: "2026-03-17",
    time: "21:00",
    location: "Main Hall",
    host: "Sheikh Ibrahim",
  },
  {
    id: 3,
    title: "Youth Halaqa",
    body: "A weekly gathering for youth ages 13–25 to discuss Islamic topics, current events, and community service opportunities.",
    image: "/nueces.jpg",
    date: "2026-03-22",
    time: "15:00",
    location: "Room 4",
    host: "Brother Yusuf",
  },
  {
    id: 4,
    title: "Sisters' Quran Circle",
    body: "A warm and welcoming space for sisters to recite, memorize, and reflect on the Quran together. All levels are welcome.",
    image: "/nueces.jpg",
    date: "2026-03-24",
    time: "19:00",
    location: "Room 2",
    host: "Sister Fatima",
  },
  {
    id: 5,
    title: "Zakat Calculation Workshop",
    body: "Sheikh Hassan will walk through the nisab threshold, applicable assets, and how to direct your Zakat locally. Free to attend.",
    image: "/nueces.jpg",
    date: "2026-03-10",
    time: "18:00",
    location: "Conference Room A",
    host: "Sheikh Hassan",
  },
];
