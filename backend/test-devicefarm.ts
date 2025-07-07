import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testDeviceFarmEndpoints() {
    console.log('🧪 Testing Device Farm Endpoints...\n');

    try {
        // Test 1: Check if the UI endpoint is accessible
        console.log('1. Testing UI endpoint...');
        const uiResponse = await fetch(`${BASE_URL}/api/devicefarm`);
        if (uiResponse.ok) {
            const html = await uiResponse.text();
            console.log('✅ UI endpoint working - HTML content length:', html.length);
        } else {
            console.log('❌ UI endpoint failed:', uiResponse.status);
        }

        // Test 2: Test upload endpoint without file (should fail)
        console.log('\n2. Testing upload endpoint without file...');
        const uploadResponse = await fetch(`${BASE_URL}/api/devicefarm/upload`, {
            method: 'POST'
        });
        if (uploadResponse.status === 400) {
            console.log('✅ Upload endpoint correctly rejects request without file');
        } else {
            console.log('❌ Upload endpoint unexpected response:', uploadResponse.status);
        }

        // Test 3: Test start-session endpoint without upload ARN (should fail)
        console.log('\n3. Testing start-session endpoint without upload ARN...');
        const sessionResponse = await fetch(`${BASE_URL}/api/devicefarm/start-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        if (sessionResponse.status === 400) {
            console.log('✅ Start-session endpoint correctly rejects request without upload ARN');
        } else {
            console.log('❌ Start-session endpoint unexpected response:', sessionResponse.status);
        }

        console.log('\n🎉 All basic endpoint tests completed!');
        console.log('\n📝 Note: Full functionality requires:');
        console.log('   - AWS credentials configured');
        console.log('   - Device Farm project and device pool ARNs');
        console.log('   - Valid APK file for testing');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the tests
testDeviceFarmEndpoints(); 