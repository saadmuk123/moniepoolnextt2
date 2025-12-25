
export const mockJoinedGroups = [
    {
        id: 'mock-group-1',
        name: 'Mock Vacation Fund',
        amount: 200,
        interval: 'monthly',
        start_date: new Date().toISOString(),
        position: 1,
        status: 'active',
        max_members: 10,
        member_count: 5
    },
    {
        id: 'mock-group-2',
        name: 'Mock Car Savings',
        amount: 100,
        interval: 'weekly',
        start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        position: 2,
        status: 'active',
        max_members: 5,
        member_count: 3
    }
];

export const mockContributions = [
    {
        amount: 200,
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 1 month ago
    },
    {
        amount: 200,
        date: new Date().toISOString()
    }
];

export const mockWalletBalance = 1500;
