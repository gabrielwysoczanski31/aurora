// Funkcja generująca losowe dane dla dashboardu deweloperskiego
export const generateData = () => {
    // Generowanie danych mieszkań
    const apartments = [];
    const statuses = ['Wynajęte', 'Dostępne', 'W remoncie', 'Rezerwacja'];
    const streets = ['Marszałkowska', 'Mickiewicza', 'Kościuszki', 'Piłsudskiego', 'Sienkiewicza', 'Słowackiego', 'Krakowska', 'Warszawska'];
    const cities = ['Warszawa', 'Kraków', 'Poznań', 'Wrocław', 'Gdańsk', 'Łódź', 'Katowice', 'Lublin'];
    
    for (let i = 1; i <= 30; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const size = Math.floor(Math.random() * 100) + 30; // 30-130 m²
      const price = (Math.floor(Math.random() * 3000) + 1500); // 1500-4500 PLN
      
      const apartment = {
        id: i,
        name: `Mieszkanie ${i}`,
        address: `ul. ${street} ${Math.floor(Math.random() * 100) + 1}/${Math.floor(Math.random() * 100) + 1}`,
        city: city,
        status: status,
        size: size,
        rooms: Math.floor(size / 20) + 1, // ~20m² na pokój
        floor: Math.floor(Math.random() * 10) + 1,
        price: price,
        hasBalcony: Math.random() > 0.3,
        hasParkingSpace: Math.random() > 0.6
      };
      
      // Dodajemy dane najemcy jeśli mieszkanie jest wynajęte
      if (status === 'Wynajęte') {
        const tenantNames = ['Jan Kowalski', 'Anna Nowak', 'Piotr Wiśniewski', 'Katarzyna Dąbrowska', 'Michał Lewandowski', 'Barbara Wójcik'];
        const tenantName = tenantNames[Math.floor(Math.random() * tenantNames.length)];
        const leaseStartMonth = Math.floor(Math.random() * 12) + 1;
        const leaseStartDay = Math.floor(Math.random() * 28) + 1;
        const leaseStart = `${leaseStartDay < 10 ? '0' + leaseStartDay : leaseStartDay}.${leaseStartMonth < 10 ? '0' + leaseStartMonth : leaseStartMonth}.2025`;
        
        const leaseEndMonth = Math.floor(Math.random() * 12) + 1;
        const leaseEndDay = Math.floor(Math.random() * 28) + 1;
        const leaseEnd = `${leaseEndDay < 10 ? '0' + leaseEndDay : leaseEndDay}.${leaseEndMonth < 10 ? '0' + leaseEndMonth : leaseEndMonth}.2026`;
        
        const lastPaymentDay = Math.floor(Math.random() * 10) + 1;
        const lastPayment = `${lastPaymentDay < 10 ? '0' + lastPaymentDay : lastPaymentDay}.03.2025`;
        
        apartment.tenantName = tenantName;
        apartment.tenantPhone = `+48 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`;
        apartment.tenantEmail = tenantName.toLowerCase().replace(' ', '.') + '@example.com';
        apartment.leaseStart = leaseStart;
        apartment.leaseEnd = leaseEnd;
        apartment.lastPayment = Math.random() > 0.2 ? lastPayment : null;
      }
      
      apartments.push(apartment);
    }
    
    // Generowanie faktur
    const invoices = [];
    const categories = ['Prąd', 'Gaz', 'Woda', 'Internet', 'Administracja', 'Remonty', 'Podatki', 'Ubezpieczenie'];
    const vendors = ['Energetyka S.A.', 'GazDom', 'WodaPlus', 'InternetFiber', 'AdminBud', 'RenoMax', 'Urząd Skarbowy', 'Ubezpieczalnia'];
    
    for (let i = 1; i <= 40; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const vendor = vendors[categories.indexOf(category)];
      const amount = Math.floor(Math.random() * 1000) + 100; // 100-1100 PLN
      const day = Math.floor(Math.random() * 28) + 1;
      const month = Math.floor(Math.random() * 3) + 1; // Styczeń - Marzec
      const date = `${day < 10 ? '0' + day : day}.0${month}.2025`;
      
      const invoice = {
        id: i,
        number: `FV/${i}/2025`,
        category: category,
        vendor: vendor,
        amount: amount,
        date: date,
        dueDate: null, // Opcjonalnie
        status: Math.random() > 0.3 ? 'Opłacona' : 'Do zapłaty'
      };
      
      invoices.push(invoice);
    }
    
    // Dane miesięcznych przychodów dla wykresu (3 miesiące)
    const monthlyIncomeData = [
      { name: 'Styczeń', przychód: 35200, koszty: 11800, zysk: 23400 },
      { name: 'Luty', przychód: 34800, koszty: 12100, zysk: 22700 },
      { name: 'Marzec', przychód: 36100, koszty: 11900, zysk: 24200 }
    ];
    
    // Dane o statusie mieszkań
    const rentalStatusData = [
      { name: 'Wynajęte', value: apartments.filter(apt => apt.status === 'Wynajęte').length },
      { name: 'Dostępne', value: apartments.filter(apt => apt.status === 'Dostępne').length },
      { name: 'W remoncie', value: apartments.filter(apt => apt.status === 'W remoncie').length },
      { name: 'Rezerwacja', value: apartments.filter(apt => apt.status === 'Rezerwacja').length }
    ];
    
    // Rozkład kosztów dla wykresu
    const costBreakdownData = [
      { name: 'Administracja', wartość: 4500 },
      { name: 'Media', wartość: 3600 },
      { name: 'Naprawy', wartość: 1800 },
      { name: 'Podatki', wartość: 2200 },
      { name: 'Ubezpieczenia', wartość: 900 },
      { name: 'Marketing', wartość: 700 },
      { name: 'Inne', wartość: 500 }
    ];
    
    // Kalendarz płatności
    const paymentCalendar = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      // Nie każdy dzień ma płatności
      if (Math.random() > 0.7) {
        const date = `${day < 10 ? '0' + day : day}.${currentMonth < 9 ? '0' + (currentMonth + 1) : (currentMonth + 1)}.${currentYear}`;
        const count = Math.floor(Math.random() * 3) + 1;
        const amount = Math.floor(Math.random() * 5000) + 1000;
        
        paymentCalendar.push({
          date,
          count,
          amount
        });
      }
    }
    
    // Aktywności
    const activities = [];
    const activityTypes = ['Nowy najemca', 'Zakończenie najmu', 'Faktura', 'Płatność', 'Zgłoszenie usterki'];
    
    for (let i = 1; i <= 15; i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const day = Math.floor(Math.random() * 31) + 1;
      const date = `${day < 10 ? '0' + day : day}.03.2025`;
      
      let description;
      switch (type) {
        case 'Nowy najemca':
          description = `Nowy najemca w mieszkaniu ${Math.floor(Math.random() * apartments.length) + 1}`;
          break;
        case 'Zakończenie najmu':
          description = `Zakończono najem mieszkania ${Math.floor(Math.random() * apartments.length) + 1}`;
          break;
        case 'Faktura':
          description = `Otrzymano fakturę ${categories[Math.floor(Math.random() * categories.length)]}`;
          break;
        case 'Płatność':
          description = `Zarejestrowano płatność czynszu`;
          break;
        case 'Zgłoszenie usterki':
          description = `Zgłoszenie usterki w mieszkaniu ${Math.floor(Math.random() * apartments.length) + 1}`;
          break;
        default:
          description = 'Inna aktywność';
      }
      
      activities.push({
        id: i,
        type,
        description,
        date,
        status: Math.random() > 0.5 ? 'Zamknięte' : 'W trakcie'
      });
    }
    
    // Sortowanie aktywności od najnowszych
    activities.sort((a, b) => {
      const dateA = a.date.split('.').reverse().join('-');
      const dateB = b.date.split('.').reverse().join('-');
      return new Date(dateB) - new Date(dateA);
    });
    
    // Dane klientów (w tym przypadku najemców)
    const clients = apartments
      .filter(apt => apt.status === 'Wynajęte')
      .map(apt => ({
        id: apt.id,
        name: apt.tenantName,
        phone: apt.tenantPhone,
        email: apt.tenantEmail,
        propertyId: apt.id,
        propertyAddress: apt.address,
        leaseStart: apt.leaseStart,
        leaseEnd: apt.leaseEnd,
        monthlyPayment: apt.price,
        lastPayment: apt.lastPayment,
        notes: Math.random() > 0.7 ? 'Preferowany kontakt mailowy' : ''
      }));
    
    return {
      apartments,
      invoices,
      monthlyIncomeData,
      rentalStatusData,
      costBreakdownData,
      paymentCalendar,
      activities,
      clients
    };
  };