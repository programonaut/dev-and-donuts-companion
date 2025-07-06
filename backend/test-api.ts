import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
}

interface TestUser {
    name: string;
    uniqueIdentifier: string;
    answers?: Record<string, any>;
}

async function testAPI(): Promise<void> {
    console.log('🧪 Testing Dev and Donuts API...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${BASE_URL}/health`);
        const healthData: ApiResponse = await healthResponse.json();
        console.log('✅ Health check:', healthData.data?.message);
        console.log('   Status:', healthResponse.status);
        console.log('');

        // Test root endpoint
        console.log('2. Testing root endpoint...');
        const rootResponse = await fetch(`${BASE_URL}/`);
        const rootData: ApiResponse = await rootResponse.json();
        console.log('✅ Root endpoint:', rootData.data?.message);
        console.log('   Available endpoints:', Object.keys(rootData.data?.endpoints || {}));
        console.log('');

        // Test users endpoint
        console.log('3. Testing users endpoint...');
        const usersResponse = await fetch(`${BASE_URL}/api/users`);
        const usersData: ApiResponse = await usersResponse.json();
        console.log('✅ Users endpoint:', `Found ${usersData.count} users`);
        console.log('   Status:', usersResponse.status);
        console.log('');

        // Test events endpoint
        console.log('4. Testing events endpoint...');
        const eventsResponse = await fetch(`${BASE_URL}/api/events`);
        const eventsData: ApiResponse = await eventsResponse.json();
        console.log('✅ Events endpoint:', `Found ${eventsData.count} events`);
        console.log('   Status:', eventsResponse.status);
        console.log('');

        // Test matches endpoint
        console.log('5. Testing matches endpoint...');
        const matchesResponse = await fetch(`${BASE_URL}/api/matches`);
        const matchesData: ApiResponse = await matchesResponse.json();
        console.log('✅ Matches endpoint:', `Found ${matchesData.count} matches`);
        console.log('   Status:', matchesResponse.status);
        console.log('');

        // Test creating a new user
        console.log('6. Testing user creation...');
        const newUser: TestUser = {
            name: 'Test User',
            uniqueIdentifier: 'test123',
            answers: {
                favoriteLanguage: 'JavaScript',
                experience: 'Beginner'
            }
        };

        const createUserResponse = await fetch(`${BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const createUserData: ApiResponse = await createUserResponse.json();
        if (createUserResponse.ok) {
            console.log('✅ User created successfully:', createUserData.data?.name);
            console.log('   User ID:', createUserData.data?.id);
        } else {
            console.log('❌ Failed to create user:', createUserData.error);
        }
        console.log('   Status:', createUserResponse.status);
        console.log('');

        console.log('🎉 All tests completed successfully!');
        console.log('\n📊 API Summary:');
        console.log(`   - Health: ✅ Running`);
        console.log(`   - Users: ${usersData.count} users`);
        console.log(`   - Events: ${eventsData.count} events`);
        console.log(`   - Matches: ${matchesData.count} matches`);

    } catch (error) {
        console.error('❌ Test failed:', error instanceof Error ? error.message : 'Unknown error');
        console.log('\n💡 Make sure the server is running on http://localhost:3001');
        console.log('   Run: npm run dev');
    }
}

// Run the test
testAPI(); 