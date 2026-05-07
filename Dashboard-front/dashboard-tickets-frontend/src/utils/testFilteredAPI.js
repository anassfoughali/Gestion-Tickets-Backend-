// Test file for the new filtered API endpoint
// This file can be used to test the API integration

import { ticketsService } from '../services/api';

export const testFilteredAPI = async () => {
  console.log('🧪 Testing Filtered Ticket Evolution API...');
  
  try {
    // Test with different priority values from your database
    const testCases = [
      {
        dateDebut: '2026-01-01',
        dateFin: '2026-02-11',
        priorite: 'Mineur'
      },
      {
        dateDebut: '2026-01-01',
        dateFin: '2026-02-11',
        priorite: 'Critique'
      },
      {
        dateDebut: '2026-01-15',
        dateFin: '2026-02-11',
        priorite: 'Majeur'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📊 Testing: ${testCase.dateDebut} to ${testCase.dateFin}, Priority: ${testCase.priorite}`);
      
      try {
        const response = await ticketsService.getEvolutionFiltered(
          testCase.dateDebut,
          testCase.dateFin,
          testCase.priorite
        );
        
        console.log('✅ Success:', response.data);
        console.log(`   - Tickets Arrivés: ${response.data.nombreTicketsArrivés}`);
        console.log(`   - Tickets Clôturés: ${response.data.nombreTicketsClotures}`);
        
      } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ General Error:', error);
  }
};

// Test URLs for Postman/Browser testing
export const getTestURLs = () => {
  const baseURL = 'http://localhost:8083/api/tickets/evolution/filtered';
  
  return [
    `${baseURL}?dateDebut=2026-01-01&dateFin=2026-02-11&priorite=Mineur`,
    `${baseURL}?dateDebut=2026-01-01&dateFin=2026-02-11&priorite=Critique`,
    `${baseURL}?dateDebut=2026-01-15&dateFin=2026-02-11&priorite=Majeur`,
  ];
};

// Usage in browser console:
// import { testFilteredAPI } from './utils/testFilteredAPI';
// testFilteredAPI();