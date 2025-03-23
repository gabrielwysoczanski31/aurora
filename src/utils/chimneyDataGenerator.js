// Funkcja generująca losowe dane dla dashboardu kominiarskiego
export const generateChimneyData = () => {
    // Generowanie danych klientów
    const clients = [];
    const clientNames = [
      'Wspólnota Mieszkaniowa "Pod Lipami"',
      'Spółdzielnia Mieszkaniowa "Centrum"', 
      'Wspólnota Mieszkaniowa "Nad Stawem"',
      'Zarząd Budynków Komunalnych',
      'Osiedle "Słoneczne"',
      'Spółdzielnia Mieszkaniowa "Przyszłość"',
      'Wspólnota Mieszkaniowa "Zielona Dolina"',
      'Administracja Domów Miejskich'
    ];
    
    for (let i = 1; i <= clientNames.length; i++) {
      clients.push({
        id: i,
        name: clientNames[i-1],
        phone: `+48 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
        email: clientNames[i-1].toLowerCase().replace(/[^a-z]/g, '') + '@example.com',
        city: ['Warszawa', 'Kraków', 'Poznań', 'Wrocław', 'Gdańsk', 'Łódź', 'Katowice', 'Lublin'][Math.floor(Math.random() * 8)],
        address: `ul. ${['Długa', 'Krótka', 'Szeroka', 'Wąska', 'Prosta', 'Kręta', 'Cicha', 'Głośna'][Math.floor(Math.random() * 8)]} ${Math.floor(Math.random() * 50) + 1}`,
        buildingsCount: Math.floor(Math.random() * 10) + 1,
        lastInspection: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pl-PL'),
        notes: Math.random() > 0.7 ? 'Preferuje kontrole w godzinach porannych' : ''
      });
    }
    
    // Generowanie danych budynków
    const buildings = [];
    
    for (let i = 1; i <= 40; i++) {
      const clientId = Math.floor(Math.random() * clients.length) + 1;
      const client = clients.find(c => c.id === clientId);
      
      buildings.push({
        id: i,
        address: `ul. ${['Marszałkowska', 'Mickiewicza', 'Kościuszki', 'Piłsudskiego', 'Sienkiewicza', 'Słowackiego', 'Krakowska', 'Warszawska'][Math.floor(Math.random() * 8)]} ${Math.floor(Math.random() * 100) + 1}`,
        city: client.city,
        postalCode: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 900) + 100}`,
        clientId: clientId,
        clientName: client.name,
        heatingType: ['Gazowe', 'Elektryczne', 'Węglowe', 'Olejowe', 'Kominkowe'][Math.floor(Math.random() * 5)],
        yearBuilt: Math.floor(Math.random() * 50) + 1970,
        floors: Math.floor(Math.random() * 10) + 1,
        apartments: Math.floor(Math.random() * 50) + 1,
        lastInspection: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toLocaleDateString('pl-PL'),
        nextInspectionDue: new Date(2025, Math.floor(Math.random() * 9) + 3, Math.floor(Math.random() * 28) + 1).toLocaleDateString('pl-PL')
      });
    }
    
    // Generowanie listy kontroli
    const inspections = [];
    const inspectionTypes = ['Przewód dymowy', 'Przewód spalinowy', 'Przewód wentylacyjny', 'Instalacja gazowa'];
    const results = ['Pozytywny', 'Negatywny', 'Warunkowy'];
    
    for (let i = 1; i <= 50; i++) {
      const buildingId = Math.floor(Math.random() * buildings.length) + 1;
      const building = buildings.find(b => b.id === buildingId);
      
      const inspectionType = inspectionTypes[Math.floor(Math.random() * inspectionTypes.length)];
      const result = results[Math.floor(Math.random() * results.length)];
      const date = new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
      
      inspections.push({
        id: i,
        buildingId: buildingId,
        type: inspectionType,
        result,
        address: building.address,
        city: building.city,
        postalCode: building.postalCode,
        clientId: building.clientId,
        clientName: building.clientName,
        date: date.toLocaleDateString('pl-PL'),
        ceebStatus: Math.random() > 0.2 ? 'Zgłoszony do CEEB' : 'Do zgłoszenia',
        technicianName: ['Jan Kowalski', 'Adam Nowak', 'Piotr Wiśniewski', 'Tomasz Lewandowski'][Math.floor(Math.random() * 4)],
        protocolNumber: `P/${Math.floor(Math.random() * 1000)}/2025`,
        notes: Math.random() > 0.7 ? 'Zalecany ponowny przegląd za 6 miesięcy' : '',
        defects: result === 'Negatywny' ? ['Zablokowany przewód', 'Uszkodzona kratka wentylacyjna', 'Nieszczelność'][Math.floor(Math.random() * 3)] : '',
        recommendations: result !== 'Pozytywny' ? ['Czyszczenie przewodu', 'Wymiana kratki', 'Uszczelnienie połączeń'][Math.floor(Math.random() * 3)] : ''
      });
    }
  
    // Dane dla wykresów
    const inspectionsByMonthData = [
      { name: 'Styczeń', ilość: 78 },
      { name: 'Luty', ilość: 62 },
      { name: 'Marzec', ilość: 50 }
    ];
  
    const inspectionsByTypeData = inspectionTypes.map(type => ({
      name: type,
      value: inspections.filter(i => i.type === type).length
    }));
  
    const inspectionsByResultData = results.map(result => ({
      name: result,
      value: inspections.filter(i => i.result === result).length
    }));
  
    const ceebStatusData = [
      { name: 'Zgłoszone do CEEB', value: inspections.filter(i => i.ceebStatus === 'Zgłoszony do CEEB').length },
      { name: 'Do zgłoszenia', value: inspections.filter(i => i.ceebStatus === 'Do zgłoszenia').length }
    ];
  
    // Dane dotyczące zgłoszeń CEEB
    const ceebReports = [
      {
        id: 'CEEB/2025/045',
        date: '15.03.2025',
        inspectionsCount: 12,
        status: 'Zaakceptowane',
        submittedBy: 'Jan Kowalski',
        acceptedDate: '16.03.2025',
        buildings: [
          { id: 1, address: buildings[0].address, city: buildings[0].city },
          { id: 2, address: buildings[1].address, city: buildings[1].city }
        ]
      },
      {
        id: 'CEEB/2025/042',
        date: '01.03.2025',
        inspectionsCount: 8,
        status: 'Zaakceptowane',
        submittedBy: 'Adam Nowak',
        acceptedDate: '02.03.2025',
        buildings: [
          { id: 3, address: buildings[2].address, city: buildings[2].city },
          { id: 4, address: buildings[3].address, city: buildings[3].city }
        ]
      },
      {
        id: 'CEEB/2025/038',
        date: '15.02.2025',
        inspectionsCount: 15,
        status: 'Zaakceptowane',
        submittedBy: 'Piotr Wiśniewski',
        acceptedDate: '17.02.2025',
        buildings: [
          { id: 5, address: buildings[4].address, city: buildings[4].city },
          { id: 6, address: buildings[5].address, city: buildings[5].city }
        ]
      }
    ];
  
    // Dane dla kalendarza kontroli
    const inspectionCalendar = [];
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayInspections = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;
      
      if (dayInspections > 0) {
        inspectionCalendar.push({
          day,
          date: date.toLocaleDateString('pl-PL'),
          count: dayInspections
        });
      }
    }
  
    // Dane dla aktywności
    const activities = [];
    const activityTypes = ['Nowa kontrola', 'Zgłoszenie CEEB', 'Nowy klient', 'Usunięcie usterki', 'Nowy budynek'];
    
    for (let i = 1; i <= 20; i++) {
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const date = new Date(2025, 2, Math.floor(Math.random() * 31) + 1);
      date.setHours(Math.floor(Math.random() * 24));
      date.setMinutes(Math.floor(Math.random() * 60));
      
      let description;
      switch (activityType) {
        case 'Nowa kontrola':
          description = `Zaplanowano kontrolę dla ${buildings[Math.floor(Math.random() * buildings.length)].address}`;
          break;
        case 'Zgłoszenie CEEB':
          description = `Przesłano zgłoszenie do CEEB z ${Math.floor(Math.random() * 15) + 1} kontrolami`;
          break;
        case 'Nowy klient':
          description = `Dodano nowego klienta: ${clientNames[Math.floor(Math.random() * clientNames.length)]}`;
          break;
        case 'Usunięcie usterki':
          description = `Usunięto usterkę w budynku przy ${buildings[Math.floor(Math.random() * buildings.length)].address}`;
          break;
        case 'Nowy budynek':
          description = `Dodano nowy budynek dla klienta ${clientNames[Math.floor(Math.random() * clientNames.length)]}`;
          break;
        default:
          description = 'Inna aktywność';
      }
      
      activities.push({
        id: i,
        type: activityType,
        description,
        date: date.toLocaleString('pl-PL'),
        status: Math.random() > 0.3 ? 'Zakończone' : 'W trakcie'
      });
    }
    
    // Sortowanie aktywności po dacie (od najnowszej)
    activities.sort((a, b) => new Date(b.date.split(',')[0].split('.').reverse().join('-')) - 
                              new Date(a.date.split(',')[0].split('.').reverse().join('-')));
  
    return { 
      inspections, 
      inspectionsByMonthData, 
      inspectionsByTypeData, 
      inspectionsByResultData, 
      ceebStatusData,
      clients,
      buildings,
      ceebReports,
      inspectionCalendar,
      activities
    };
  };