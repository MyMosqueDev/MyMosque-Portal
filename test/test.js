import { sendNotifications } from '../lib/notifications.js';

/**
 * Test function for sendNotifications
 * 
 * Note: This test uses mock/example data. In a real scenario, you'd want to:
 * 1. Mock the Expo SDK to avoid actually sending notifications
 * 2. Use a testing framework like Jest or Vitest
 * 3. Add proper assertions
 */

async function testSendNotifications() {
  console.log('🧪 Testing sendNotifications function...\n');

  // Test case 1: Valid Expo push tokens
  console.log('Test 1: Valid push tokens');
  const validPushTokens = [
    { push_token: 'ExponentPushToken[FmQ-24JD168fqYRyHpRs3H]' },
    // { push_token: 'ExponentPushToken[IDtnDjONa_qpIemIzqeVZQ]' },
  ];

  try {
    const result = await sendNotifications({
      pushTokens: validPushTokens,
      title: 'Test Notification',
      body: 'This is a test notification body',
    });
    console.log('✅ Test 1 passed: Function executed without throwing\n');
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }

//   // Test case 2: Invalid push tokens (should be skipped)
//   console.log('Test 2: Invalid push tokens');
//   const invalidPushTokens = [
//     { push_token: 'invalid-token-123' },
//     { push_token: 'not-an-expo-token' },
//   ];

//   try {
//     await sendNotifications({
//       pushTokens: invalidPushTokens,
//       title: 'Test Notification',
//       body: 'This should be skipped',
//     });
//     console.log('✅ Test 2 passed: Invalid tokens were skipped\n');
//   } catch (error) {
//     console.error('❌ Test 2 failed:', error);
//   }

//   // Test case 3: Mixed valid and invalid tokens
//   console.log('Test 3: Mixed valid and invalid tokens');
//   const mixedPushTokens = [
//     { push_token: 'ExponentPushToken[validtoken123456789]' },
//     { push_token: 'invalid-token' },
//     { push_token: 'ExponentPushToken[anothervalidtoken]' },
//   ];

//   try {
//     await sendNotifications({
//       pushTokens: mixedPushTokens,
//       title: 'Mixed Test',
//       body: 'Testing with mixed tokens',
//     });
//     console.log('✅ Test 3 passed: Mixed tokens handled correctly\n');
//   } catch (error) {
//     console.error('❌ Test 3 failed:', error);
//   }

//   // Test case 4: Empty array
//   console.log('Test 4: Empty push tokens array');
//   try {
//     await sendNotifications({
//       pushTokens: [],
//       title: 'Empty Test',
//       body: 'No tokens to send',
//     });
//     console.log('✅ Test 4 passed: Empty array handled correctly\n');
//   } catch (error) {
//     console.error('❌ Test 4 failed:', error);
//   }

//   // Test case 5: Missing required fields
//   console.log('Test 5: Missing title/body');
//   try {
//     await sendNotifications({
//       pushTokens: [{ push_token: 'ExponentPushToken[test]' }],
//       title: '',
//       body: '',
//     });
//     console.log('✅ Test 5 passed: Empty title/body handled\n');
//   } catch (error) {
//     console.error('❌ Test 5 failed:', error);
//   }

//   console.log('🏁 All tests completed!');
}

// Run the test
testSendNotifications().catch(console.error);

export { testSendNotifications };

