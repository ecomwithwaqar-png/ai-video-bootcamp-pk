// Scratch script to test the exact phone number normalization logic used in api/capi.js

function normalizePhone(rawPhone) {
    if (!rawPhone) return undefined;
    let ph = rawPhone.toString().replace(/\D/g, '');
    if (ph.startsWith('0')) {
        ph = '92' + ph.substring(1);
    } else if (ph.length === 10) {
        ph = '92' + ph;
    }
    return ph;
}

const testCases = [
    { input: "03001234567", expected: "923001234567" },
    { input: "3001234567", expected: "923001234567" },
    { input: "923001234567", expected: "923001234567" },
    { input: "+92 (300) 123-4567", expected: "923001234567" },
    { input: "00923001234567", expected: "923001234567" },
    { input: " 0300-1234567 ", expected: "923001234567" }
];

console.log("=== RUNNING PHONE NORMALIZATION TEST CASES ===");
let allPassed = true;
testCases.forEach((tc, idx) => {
    const result = normalizePhone(tc.input);
    const passed = result === tc.expected;
    console.log(`Case ${idx + 1}: Input: "${tc.input}" | Output: "${result}" | Expected: "${tc.expected}" | ${passed ? "✅ PASS" : "❌ FAIL"}`);
    if (!passed) allPassed = false;
});

console.log("\nResult:", allPassed ? "ALL TEST CASES PASSED! 🎉" : "SOME TEST CASES FAILED. ❌");
