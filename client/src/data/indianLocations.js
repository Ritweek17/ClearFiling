/**
 * indianLocations.js
 * Comprehensive mapping of Indian States and Union Territories with major commercial cities.
 * Includes an "Other" option for every state/UT to ensure complete nationwide coverage.
 */

export const INDIAN_LOCATIONS = {
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
    'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Other'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Other'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur', 'Bongaigaon', 'Other'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia',
    'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Other'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg',
    'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Other'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Other'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Other'
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar',
    'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Other'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Baddi', 'Other'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Other'
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi',
    'Kalaburagi', 'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Other'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur',
    'Kannur', 'Alappuzha', 'Palakkad', 'Kottayam', 'Malappuram', 'Other'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain',
    'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Other'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik',
    'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad (Chhatrapati Sambhajinagar)',
    'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Kolhapur', 'Amravati', 'Nanded', 'Other'
  ],
  'Manipur': [
    'Imphal', 'Churachandpur', 'Thoubal', 'Other'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Jowai', 'Other'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Champhai', 'Other'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Other'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Other'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Mohali (SAS Nagar)', 'Hoshiarpur', 'Batala', 'Pathankot', 'Other'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer',
    'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Sri Ganganagar', 'Other'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Geyzing', 'Other'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tiruppur', 'Erode', 'Tirunelveli', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Other'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam',
    'Khammam', 'Mahbubnagar', 'Other'
  ],
  'Tripura': [
    'Agartala', 'Dharmanagar', 'Udaipur', 'Other'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut',
    'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad',
    'Saharanpur', 'Gorakhpur', 'Noida', 'Greater Noida', 'Firozabad',
    'Jhansi', 'Muzaffarnagar', 'Mathura', 'Ayodhya', 'Deoria', 'Other'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Other'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur',
    'Bardhaman', 'Malda', 'Kharagpur', 'Habra', 'Other'
  ],

  // Union Territories
  'Andaman and Nicobar Islands': [
    'Port Blair', 'Other'
  ],
  'Chandigarh': [
    'Chandigarh', 'Other'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Daman', 'Diu', 'Silvassa', 'Other'
  ],
  'Delhi (NCT)': [
    'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi',
    'West Delhi', 'North West Delhi', 'South West Delhi', 'North East Delhi',
    'Dwarka', 'Rohini', 'Connaught Place', 'Other'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur', 'Other'
  ],
  'Ladakh': [
    'Leh', 'Kargil', 'Other'
  ],
  'Lakshadweep': [
    'Kavaratti', 'Agatti', 'Amini', 'Other'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Other'
  ]
};

export const INDIAN_STATES = Object.keys(INDIAN_LOCATIONS).sort((a, b) => a.localeCompare(b));

export const getCitiesForState = (state) => {
  if (!state || !INDIAN_LOCATIONS[state]) return [];
  return INDIAN_LOCATIONS[state];
};

export default {
  INDIAN_LOCATIONS,
  INDIAN_STATES,
  getCitiesForState
};

