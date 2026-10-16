export type Role = 'A' | 'B';
export const roleNames: Record<Role, string> = { A: 'Witness Investigator', B: 'Records Investigator' };
export const CASE_ID = 'the-missing-envelope';
export const CASE_VERSION = 1;

// Authored case content. Author-only Markdown is never imported into the application.
export const introduction = "A guest’s sealed envelope has vanished from the archive. Three hotel employees had access tonight. One of you has the witness statements. The other has the hotel records. Work together to recover it before the guest returns.";

export type Evidence = { id: string; title: string; source: string; paragraphs: readonly string[];
  kind?: 'statement' | 'maintenance' | 'access' | 'storage' | 'letter' | 'log' | 'plan' | 'archive' };
export type Round = {
  title: string; question: string; options: readonly string[]; correct: string;
  evidence: Record<Role, Evidence>; hints: readonly string[]; deduction: string; proof: string;
};
export const rounds: readonly Round[] = [
  {
    title: 'A question of time', question: 'At what actual time was the envelope removed?',
    options: ['22:10', '22:14', '22:18'], correct: '22:10',
    evidence: {
      A: { id: 'A1', title: 'The corridor witness', source: 'Witness statement · Archive corridor', paragraphs: [
        '“I saw someone lift the guest’s identifiable sealed envelope from the archive shelf. At that exact moment, the corridor clock read 22:14.”',
        '“I couldn’t identify the person.”',
        'This is an observed clock reading. It is not necessarily the true hotel time.',
      ] },
      B: { id: 'B1', title: 'Four minutes ahead', source: 'Verified record · Maintenance desk', paragraphs: [
        'The corridor clock was exactly four minutes FAST throughout the evening.',
        'It was not adjusted until 23:00.',
        'All other official records use correct hotel time.',
      ] },
    },
    hints: [
      'Compare what the witness saw on the clock with what maintenance knows about that clock.',
      'A fast clock displays a later time than the actual time. Correct the witness’s reading by the recorded difference.',
      'The clock showed 22:14 and was four minutes fast. Subtract four minutes: the envelope was removed at 22:10.',
    ],
    deduction: 'The envelope was removed at 22:10.',
    proof: 'A1 gives a displayed reading of 22:14. B1 establishes that this clock was four minutes fast. 22:14 minus four minutes is 22:10.',
  },
  {
    title: 'A detail in the dark', question: 'Who removed the envelope?',
    options: ['Ada', 'Leo', 'Nora'], correct: 'Nora',
    evidence: {
      A: { id: 'A2', title: 'A glimpse of the cuffs', source: 'Witness statement · Archive doorway', paragraphs: [
        '“I clearly saw narrow striped cuffs on the same person who lifted the envelope from the archive shelf, now carrying it away.”',
        '“I didn’t see their face.”',
      ] },
      B: { id: 'B2', title: 'The archive register', source: 'Verified record · Access & uniforms', paragraphs: [
        'Ada · Plain cuffs\nPresent from 22:00 until 22:20.',
        'Leo · Narrow striped cuffs\nPresent from 22:12 until 22:30.',
        'Nora · Narrow striped cuffs\nPresent from 22:00 until 22:11.',
        'These are verified presence intervals, not planned shifts. These are all three people who entered the archive tonight. No one else entered, and no uniform changes occurred.',
      ] },
    },
    hints: [
      'Use your confirmed removal time alongside the detail in the witness statement and the archive register.',
      'Check who was actually present at 22:10. Then compare their cuffs. Matching a uniform alone is not enough.',
      'At 22:10, Ada and Nora were present. Ada had plain cuffs; Nora had narrow striped cuffs. Leo arrived at 22:12. The person who removed the envelope was Nora.',
    ],
    deduction: 'Nora removed the envelope.',
    proof: 'The confirmed time is 22:10. B2 places Ada and Nora in the archive then; Leo entered at 22:12. A2 identifies narrow striped cuffs on the same person who lifted the envelope. Only Nora fits both time and uniform.',
  },
  {
    title: 'Behind a locked door', question: 'Where should you look for the envelope?',
    options: ['Reception lost-property drawer', 'Boiler-room tool cupboard', 'Upstairs linen-room dry-document cabinet'],
    correct: 'Upstairs linen-room dry-document cabinet',
    evidence: {
      A: { id: 'A3', title: 'The porter’s account', source: 'Witness statement · Service passage', paragraphs: [
        '“I followed the carrier into the service passage. They unlocked a storage compartment using a key marked B with a SQUARE head, placed the envelope inside, and locked it.”',
        '“Earlier, I saw water dripping onto the archive shelving. I don’t know the compartment’s name.”',
      ] },
      B: { id: 'B3', title: 'The storage-key register', source: 'Verified record · Housekeeping', paragraphs: [
        'Key A · Square head\nReception lost-property drawer.',
        'Key B · Round head\nBoiler-room tool cupboard.',
        'Key B · Square head\nDry-document cabinet in the upstairs linen room.',
        'The letter and head shape together identify unique keys. There are no duplicate compartments.',
      ] },
    },
    hints: [
      'Compare the key the porter observed with the storage-key register.',
      'Use both the letter and the head shape. Either detail alone leaves two possible keys.',
      'The porter saw a B key with a square head. The register maps that combination to the upstairs linen-room dry-document cabinet.',
    ],
    deduction: 'The envelope is in the upstairs linen-room dry-document cabinet.',
    proof: 'A3 supplies both B and a square head. B3 maps this exact combination to the dry-document cabinet in the upstairs linen room.',
  },
];

export const ending = {
  recovery: 'Upstairs, rain taps softly against the linen-room window. You unlock the dry-document cabinet. There it is: the guest’s envelope, dry and still sealed.',
  note: '“A pipe was leaking over the archive shelf. I moved the envelope to the dry-document cabinet to keep it safe. I was called away before I could record the transfer. I’m sorry for the confusion.”',
  signature: 'Nora · Bellweather Hotel',
  conclusion: 'The signed note confirms why Nora moved it. Before recovery, you had established her actions and the destination—not her intent. The envelope can now be returned to the guest. Case closed.',
};
