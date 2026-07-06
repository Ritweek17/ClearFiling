/**
 * officeLocations.js — All physical office data.
 * To add/update offices: edit ONLY this file.
 * Components read this array and never contain hardcoded addresses.
 *
 * Field guide:
 *   mapsUrl    — Google Maps embed/link URL. Set to null until client provides it.
 *   mapsEmbed  — Google Maps iframe src for embedded map. Set to null until available.
 *   landmark   — Nearby landmark for easy navigation.
 */

const OFFICE_LOCATIONS = [
  {
    id: 'delhi',
    label: 'Delhi Office',
    city: 'New Delhi',
    isHeadquarters: true,
    badge: 'Head Office',
    addressLine1: 'E-20, Lajpat Nagar III',
    addressLine2: 'New Delhi – 110024',
    addressLine3: 'India',
    fullAddress: 'E-20, Lajpat Nagar III, New Delhi – 110024, India',
    landmark: 'Near Lajpat Nagar Metro Station',
    pincode: '110024',
    state: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    phone: '+91 9250201718',
    phoneHref: 'tel:+919250201718',
    email: 'clearfiling@zohomail.in',
    emails: [
      'clearfiling@zohomail.in',
      'support.clearfiling@gmail.com'
    ],
    // Geo coordinates — update when confirmed
    geo: { lat: 28.5659, lng: 77.2433 },
    // Google Maps — set to real URL when client provides
    mapsUrl: null,
    mapsEmbed: null,
    schema: {
      streetAddress: 'E-20, Lajpat Nagar III',
      addressLocality: 'New Delhi',
      postalCode: '110024',
    },
  },
  {
    id: 'deoria',
    label: 'Deoria Office',
    city: 'Deoria',
    isHeadquarters: false,
    badge: 'Branch Office',
    addressLine1: 'Asha Complex, 30 Feet Road',
    addressLine2: 'Near Nahar, Bhikhampur Road',
    addressLine3: 'Deoria – 274001, Uttar Pradesh',
    fullAddress: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road, Deoria – 274001, Uttar Pradesh',
    landmark: 'Near Nahar, Bhikhampur Road',
    pincode: '274001',
    state: 'Uttar Pradesh',
    country: 'India',
    countryCode: 'IN',
    phone: '05568-450351',
    phoneHref: 'tel:05568450351',
    email: 'clearfiling@zohomail.in',
    emails: [
      'clearfiling@zohomail.in',
      'support.clearfiling@gmail.com'
    ],
    geo: { lat: 26.5028, lng: 83.7804 },
    mapsUrl: null,
    mapsEmbed: null,
    schema: {
      streetAddress: 'Asha Complex, 30 Feet Road, Near Nahar, Bhikhampur Road',
      addressLocality: 'Deoria',
      addressRegion: 'Uttar Pradesh',
      postalCode: '274001',
    },
  },
  {
    id: 'gorakhpur',
    label: 'Gorakhpur Office',
    city: 'Gorakhpur',
    isHeadquarters: false,
    badge: 'Branch Office',
    addressLine1: '100D, Surajkund Colony',
    addressLine2: 'Gorakhpur – 273015',
    addressLine3: 'Uttar Pradesh, India',
    fullAddress: '100D, Surajkund Colony, Gorakhpur – 273015, Uttar Pradesh, India',
    landmark: 'Surajkund Colony',
    pincode: '273015',
    state: 'Uttar Pradesh',
    country: 'India',
    countryCode: 'IN',
    phone: '+91 9250201718',
    phoneHref: 'tel:+919250201718',
    email: 'clearfiling@zohomail.in',
    emails: [
      'clearfiling@zohomail.in',
      'support.clearfiling@gmail.com'
    ],
    geo: { lat: 26.7606, lng: 83.3731 },
    mapsUrl: null,
    mapsEmbed: null,
    schema: {
      streetAddress: '100D, Surajkund Colony',
      addressLocality: 'Gorakhpur',
      addressRegion: 'Uttar Pradesh',
      postalCode: '273015',
    },
  },
];

export default OFFICE_LOCATIONS;
