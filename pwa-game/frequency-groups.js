// Thai consonants organized by frequency groups for progressive learning
// Based on actual usage frequency data

const FREQUENCY_GROUPS = {
  'Group 1: Super Common (25%+)': [
    ['น', 'โน นาก', 'noo naak', 'n', 'n'],      // 35.47%
    ['ร', 'รอ เรือ', 'roo reua', 'r', 'n'],     // 34.79%
    ['ก', 'กอ ไก่', 'goo gai', 'g', 'k'],       // 31.08%
    ['อ', 'ออ อ่าง', 'oo aang', 'ʔ', ''],       // 28.01%
    ['ง', 'งอ งู', 'ngoo nguu', 'ng', 'ng'],     // 27.08%
    ['ม', 'มอ ม้า', 'moo maa', 'm', 'm'],       // 24.85%
  ],
  
  'Group 2: Very Common (15-25%)': [
    ['ย', 'ยอ ยักษ์', 'yoo yak', 'y', 'y'],     // 21.87%
    ['ว', 'วอ แวน', 'woo waen', 'w', 'w'],      // 21.03%
    ['ล', 'ลอ ลิง', 'loo ling', 'l', 'n'],      // 18.76%
    ['ด', 'ดอ เด็ก', 'doo dek', 'd', 't'],      // 17.42%
    ['ต', 'ตอ เต่า', 'too tao', 't', 't'],      // 16.87%
    ['ส', 'สอ เสือ', 'soo seua', 's', 't'],     // 16.79%
  ],
  
  'Group 3: Common (10-15%)': [
    ['ค', 'คอ ควาย', 'koo kwaai', 'k', 'k'],    // 14.95%
    ['ห', 'หอ หีบ', 'hoo hiip', 'h', ''],       // 14.90%
    ['บ', 'บอ ใบไม้', 'boo bai mai', 'b', 'p'], // 13.61%
    ['ท', 'ทอ ทหาร', 'too tahaan', 't', 't'],   // 12.93%
    ['ป', 'ปอ ปลา', 'poo plaa', 'p', 'p'],     // 11.80%
    ['พ', 'พอ พาน', 'poo paan', 'p', 'p'],      // 10.19%
  ],
  
  'Group 4: Moderate (5-10%)': [
    ['จ', 'จอ จาน', 'joo jaan', 'j', 't'],      // 9.33%
    ['ข', 'ขอ ไข่', 'koo kai', 'k', 'k'],       // 8.14%
    ['ช', 'ชอ ช้าง', 'choo chaang', 'ch', 't'], // 7.98%
    ['ศ', 'ศอ ศาลา', 'soo saala', 's', 't'],    // 4.26%
    ['ผ', 'ผอ ผึ้ง', 'poo pheung', 'p', ''],    // 4.11%
    ['ถ', 'ถอ ถุง', 'too thung', 't', 't'],      // 3.71%
  ],
  
  'Group 5: Less Common (2-3%)': [
    ['ณ', 'ณอ เณร', 'noo nen', 'n', 'n'],       // 3.15%
    ['ธ', 'ธอ ธง', 'too thong', 't', 't'],       // 3.11%
    ['ภ', 'ภอ สำเภา', 'poo samphao', 'p', 'p'], // 2.97%
    ['ษ', 'ษอ ฤาษี', 'soo reusii', 's', 't'],   // 2.74%
    ['ญ', 'ญอ หญิง', 'yoo ying', 'y', 'n'],     // 2.46%
    ['ซ', 'ซอ โซ่', 'soo soo', 's', 't'],       // 2.04%
  ],
  
  'Group 6: Rare (1-2%)': [
    ['ฟ', 'ฟอ ฟัน', 'foo fan', 'f', 'p'],       // 1.91%
    ['ฉ', 'ฉอ ฉิ่ง', 'choo ching', 'ch', ''],   // 1.28%
    ['ฝ', 'ฝอ ฝา', 'foo faa', 'f', ''],         // 1.13%
  ],
  
  'Group 7: Very Rare (0.3-1%)': [
    ['ฐ', 'ฐอ ฐาน', 'too thaan', 't', 't'],     // 0.74%
    ['ฑ', 'ฑอ มณโฑ', 'too monthoo', 't', 't'],  // 0.55%
    ['ฮ', 'ฮอ นกฮูก', 'hoo nok huuk', 'h', ''], // 0.49%
    ['ฤ', 'ฤอ ฤาษี', 'rue reusii', 'r', ''],    // 0.47%
    ['ฏ', 'ฏอ ปฏัก', 'too patak', 't', 't'],    // 0.40%
    ['ฎ', 'ฎอ ชฎา', 'doo chadaa', 'd', 't'],    // 0.38%
    ['ฆ', 'ฆอ ระฆัง', 'koo ragang', 'k', 'k'],  // 0.36%
  ],
  
  'Group 8: Extremely Rare (<0.3%)': [
    ['ฒ', 'ฒอ ผู้เฒ่า', 'too phuu thao', 't', 't'], // 0.20%
    ['ฬ', 'ฬอ จุฬา', 'loo julaa', 'l', 'n'],       // 0.16%
    ['ฌ', 'ฌอ เฌอ', 'choo chəə', 'ch', ''],        // 0.05%
    ['ฃ', 'ฃอ ขวด', 'koo kuat', 'k', 'k'],         // 0.00%
    ['ฅ', 'ฅอ คน', 'koo khon', 'k', 'k'],           // 0.00%
    ['ฦ', 'ฦอ ฦๅ', 'lue lue', 'l', ''],             // 0.00%
  ]
};

// Export the groups for use in the game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FREQUENCY_GROUPS };
}
