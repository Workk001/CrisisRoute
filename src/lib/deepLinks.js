/**
 * Returns primary and optional secondary booking deep links for a rescue option.
 * Links pre-fill route details where possible.
 */
export function getBookingLink(option) {
  const mode = option.mode?.toLowerCase() || ''
  const operator = option.operator?.toLowerCase() || ''
  const identifier = option.identifier?.toLowerCase() || ''

  // Extract station codes from parentheses — e.g. "15:45 from Mumbai Central (MMCT)"
  const depMatch = option.departure?.match(/\(([^)]+)\)/)
  const arrMatch = option.arrival?.match(/\(([^)]+)\)/)
  const fromCode = depMatch?.[1] || ''
  const toCode = arrMatch?.[1] || ''

  // Date strings
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const irctcDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`

  // ── FLIGHTS ──
  if (mode === 'flight') {
    const fromCity = option.departure?.split(' from ')?.[1]?.split(' (')?.[0] || ''
    const toCity = option.arrival?.split(' at ')?.[1]?.split(' (')?.[0] || ''

    const airports = {
      'mumbai': 'BOM', 'chhatrapati shivaji': 'BOM',
      'delhi': 'DEL', 'indira gandhi': 'DEL', 'new delhi': 'DEL',
      'ahmedabad': 'AMD', 'sardar vallabhbhai': 'AMD',
      'bangalore': 'BLR', 'bengaluru': 'BLR', 'kempegowda': 'BLR',
      'chennai': 'MAA',
      'hyderabad': 'HYD', 'rajiv gandhi': 'HYD',
      'kolkata': 'CCU', 'netaji subhas': 'CCU',
      'pune': 'PNQ',
      'goa': 'GOI',
      'jaipur': 'JAI',
      'lucknow': 'LKO',
      'surat': 'STV',
    }

    let fromAirport = fromCode
    let toAirport = toCode

    for (const [key, val] of Object.entries(airports)) {
      if (fromCity.toLowerCase().includes(key)) fromAirport = val
      if (toCity.toLowerCase().includes(key)) toAirport = val
    }

    if (operator.includes('indigo') || identifier.includes('6e')) {
      return {
        primary: {
          label: 'CHECK ON INDIGO',
          url: `https://book.goindigo.in/booking/SearchTrips?origin=${fromAirport}&destination=${toAirport}&travelDate=${dateStr}&tripType=O&adults=1&children=0&infants=0&class=Economy`,
        },
        secondary: {
          label: 'CHECK ON GOOGLE FLIGHTS',
          url: 'https://www.google.com/travel/flights',
        },
      }
    }
    if (operator.includes('spicejet') || identifier.includes('sg')) {
      return {
        primary: { label: 'CHECK ON SPICEJET', url: 'https://www.spicejet.com/' },
        secondary: { label: 'CHECK ON MAKEMYTRIP', url: 'https://www.makemytrip.com/flights/' },
      }
    }
    if (operator.includes('air india') || identifier.includes('ai')) {
      return {
        primary: { label: 'CHECK ON AIR INDIA', url: 'https://www.airindia.com/' },
        secondary: { label: 'CHECK ON MAKEMYTRIP', url: 'https://www.makemytrip.com/flights/' },
      }
    }
    if (operator.includes('akasa') || identifier.includes('qp')) {
      return {
        primary: { label: 'CHECK ON AKASA AIR', url: 'https://www.akasaair.com/' },
        secondary: { label: 'CHECK ON EASEMYTRIP', url: 'https://flight.easemytrip.com/' },
      }
    }
    // Generic flight fallback
    return {
      primary: { label: 'CHECK ON GOOGLE FLIGHTS', url: 'https://www.google.com/travel/flights' },
      secondary: { label: 'CHECK ON MAKEMYTRIP', url: 'https://www.makemytrip.com/flights/' },
    }
  }

  // ── TRAINS ──
  if (mode === 'train') {
    const trainNum = option.identifier?.match(/^\d{5}/)?.[0] || ''

    return {
      primary: {
        label: 'CHECK ON IRCTC',
        url: trainNum
          ? `https://www.irctc.co.in/nget/train-search?fromStation=${fromCode}&toStation=${toCode}&jorneyDate=${irctcDate}&trainNo=${trainNum}`
          : `https://www.irctc.co.in/nget/train-search?fromStation=${fromCode}&toStation=${toCode}&jorneyDate=${irctcDate}`,
      },
      secondary: {
        label: 'CHECK ON CONFIRMTKT',
        url: trainNum ? `https://confirmtkt.com/train/${trainNum}` : 'https://confirmtkt.com/',
      },
    }
  }

  // ── BUSES ──
  if (mode === 'bus') {
    const fromCity = option.departure?.split(' from ')?.[1]?.split(' (')?.[0] || ''
    const toCity = option.arrival?.split(' at ')?.[1]?.split(' (')?.[0] || ''
    const slug = (city) => city.toLowerCase().replace(/\s+/g, '-')

    if (operator.includes('gsrtc')) {
      return {
        primary: { label: 'CHECK ON GSRTC', url: 'https://gsrtc.in/site/' },
        secondary: { label: 'CHECK ON REDBUS', url: `https://www.redbus.in/bus-tickets/${slug(fromCity)}-to-${slug(toCity)}` },
      }
    }
    if (operator.includes('msrtc')) {
      return {
        primary: { label: 'CHECK ON MSRTC', url: 'https://mahamtransport.maharashtra.gov.in/' },
        secondary: { label: 'CHECK ON REDBUS', url: `https://www.redbus.in/bus-tickets/${slug(fromCity)}-to-${slug(toCity)}` },
      }
    }
    return {
      primary: { label: 'CHECK ON REDBUS', url: `https://www.redbus.in/bus-tickets/${slug(fromCity)}-to-${slug(toCity)}` },
      secondary: { label: 'CHECK ON ABHIBUS', url: 'https://www.abhibus.com/' },
    }
  }

  // ── CABS ──
  if (mode === 'cab') {
    return {
      primary: { label: 'CHECK ON OLA INTERCITY', url: 'https://www.olacabs.com/' },
      secondary: { label: 'CHECK ON UBER', url: 'https://m.uber.com/' },
    }
  }

  // ── FALLBACK ──
  return {
    primary: { label: 'SEARCH OPTIONS', url: 'https://www.google.com/travel' },
  }
}
