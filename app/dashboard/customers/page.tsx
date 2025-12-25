// export default function Page() {
//   return <p>customers Page</p>;
// }

'use client';

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchLatestInvoices} from '@/app/lib/data';
import { Suspense } from 'react'; 
import { RevenueChartSkeleton,
  LatestInvoicesSkeleton
 } from '@/app/ui/skeletons';

import { FeatureCard } from '@/app/ui/FeatureCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
 
// export default async function Page() {
//     // const revenue = await fetchRevenue();
//        const {
//     numberOfInvoices,
//     numberOfCustomers,
//     totalPaidInvoices,
//     totalPendingInvoices,
//   } = await fetchCardData();}


  export default function FourCards() {
    const handleButtonClick = (cardName: string) => {
      alert('Button clicked on ${cardName}!');
    }

    const cardsData = [{
      title: 'Create Group',
      description: 'group creation',
      buttonText: 'Create Group Page',
      buttonAction: () => {
      window.location.assign('/dashboard/groups/groupcreate');

      },
    }, {
      title: 'Upcoming Payment',
      description: 'This is the second card', 
      buttonText: 'View Payments',
      buttonAction: () => handleButtonClick('Card two'),
    }, {  
      title: 'Group Contribution',
      description: 'This is the third card',
      buttonText: 'Action Three',   
      buttonAction: () => handleButtonClick('Card three'),
    }, {
      title: 'Wallet', 
      description: 'This is the fourth card',
      buttonText: 'Action Four',
      buttonAction: () => handleButtonClick('Card four'), 
    },
    ]

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Customers Dashboard
        <span className="text-gray-500"> - Welcome to your dashboard</span> 
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardsData.map((card, index) => (
          <FeatureCard
            key={index}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            buttonAction={card.buttonAction}
          />
        ))}
      </div>
      
      
    </main>
  );
}