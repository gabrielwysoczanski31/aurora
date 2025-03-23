// src/utils/dataGenerator.js

export function generateData() {
    return {
      activities: [
        { title: 'Kontrola kominowa', date: '2024-03-21' },
        { title: 'Zgłoszenie CEEB', date: '2024-03-22' },
        { title: 'Nowy klient', date: '2024-03-23' },
      ],
      stats: {
        total: 42,
        pending: 17,
        completed: 25,
      },
      inspections: [
        { date: '21.03.2024', count: 3 },
        { date: '22.03.2024', count: 5 },
        { date: '23.03.2024', count: 2 },
      ],
      clients: [],
      buildings: [],
      ceebReports: [],
    };
  }