// data/dashboardData.js
export const dashboardData = {
    homepage: {
      welcomeMessage: "Welcome to St. Mary's Parish",
      heroSubtitle: "A community of faith, hope, and love serving God together",
      backgroundImage: "/api/placeholder/1200/600"
    },
    massSchedule: {
      sunday: [
        { time: "7:00 AM", type: "Morning Mass" },
        { time: "9:00 AM", type: "Family Mass" },
        { time: "11:00 AM", type: "High Mass" },
        { time: "6:00 PMsss", type: "Evening Mass" }
      ],
      weekday: [
        { day: "Monday-Friday", time: "7:00 AM", type: "Morning Mass" },
        { day: "Saturday", time: "8:00 AM", type: "Morning Mass" }
      ],
      confession: [
        { day: "Saturday", time: "4:00-5:00 PM" },
        { day: "Sunday", time: "30 min before each Mass" }
      ]
    },
    aboutUs: {
      history: "Founded in 1952, St. Mary's Parish has been a cornerstone of our community for over 70 years.",
      mission: "To worship God, serve our community, and spread the Gospel through love and action.",
      pastor: "Rev. Father Michael Johnson",
      establishedYear: "1952"
    },
    ministries: [
      { id: 1, name: "Youth Group", description: "For ages 13-18, meeting every Wednesday", coordinator: "Sarah Martinez" },
      { id: 2, name: "Choir", description: "Sunday morning worship music ministry", coordinator: "David Chen" },
      { id: 3, name: "Outreach Program", description: "Community service and charity work", coordinator: "Maria Rodriguez" },
      { id: 4, name: "Bible Study", description: "Weekly scripture study groups", coordinator: "James Wilson" }
    ],
    events: [
      { id: 1, title: "Parish Retreat", date: "2025-07-15", description: "Annual spiritual retreat at Mount Calvary", time: "9:00 AM - 5:00 PM" },
      { id: 2, title: "Food Drive", date: "2025-06-20", description: "Monthly community food collection", time: "After all Masses" },
      { id: 3, title: "Youth Camp", date: "2025-08-10", description: "Summer camp for young parishioners", time: "Week-long event" }
    ],
    liturgicalCalendar: [
      { id: 1, event: "Pentecost Sunday", date: "2025-06-08", description: "Celebration of the Holy Spirit" },
      { id: 2, event: "Assumption of Mary", date: "2025-08-15", description: "Holy Day of Obligation" },
      { id: 3, event: "All Saints Day", date: "2025-11-01", description: "Honoring all saints" }
    ],
    gallery: [
      { id: 1, title: "Easter Celebration 2025", image: "/api/placeholder/400/300", category: "Liturgical" },
      { id: 2, title: "Community Outreach", image: "/api/placeholder/400/300", category: "Service" },
      { id: 3, title: "Youth Group Activity", image: "/api/placeholder/400/300", category: "Youth" },
      { id: 4, title: "Christmas Mass", image: "/api/placeholder/400/300", category: "Liturgical" }
    ],
    contact: {
      address: "123 Faith Street, Springfield, ST 12345",
      phone: "(555) 123-4567",
      email: "info@stmarysparish.org",
      website: "www.stmarysparish.org"
    },
    socialMedia: {
      facebook: "https://facebook.com/stmarysparish",
      instagram: "https://instagram.com/stmarysparish",
      twitter: "https://twitter.com/stmarysparish"
    },
    prayerRequests: [
      { id: 1, name: "John D.", request: "For healing and recovery", date: "2025-06-01", status: "active" },
      { id: 2, name: "Maria S.", request: "For family unity", date: "2025-06-03", status: "active" },
      { id: 3, name: "Anonymous", request: "For employment opportunity", date: "2025-06-04", status: "active" }
    ],
    newsletters: [
      { id: 1, email: "john@example.com", subscribed: "2025-01-15", status: "active" },
      { id: 2, email: "maria@example.com", subscribed: "2025-02-20", status: "active" },
      { id: 3, email: "david@example.com", subscribed: "2025-03-10", status: "active" }
    ]
  };