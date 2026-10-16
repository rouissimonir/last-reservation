import type { CaseDefinition } from './cases';

// Authored content for edition 05 (free). Answers live here only; docs are author-only and never imported.
export const musicBox: CaseDefinition = {
  id: 'the-music-box', version: 1, edition: '05', title: 'The Music Box',
  coverTitle: 'The Music\nBox', format: 'Short case · 3 deductions',
  hook: 'A birthday dinner arrived. The present did not.',
  description: 'The birthday dinner arrives. The present does not. A lighter service lift, a false account and a trail on the carpet lead away from Room 207.',
  duration: 'Length not yet measured by playtests',
  setting: 'Bellweather Hotel · November 1994',
  introLabel: 'A BIRTHDAY DINNER, 1 NOVEMBER 1994', introTitle: 'One parcel short.',
  endingTitle: 'Dry, and wrapped again.', noteLabel: 'THE DUTY MANAGER’S RECORD', noteTitle: 'Lucy answers',
  introduction: 'Bellweather Hotel, 1 November 1994. Mr Hollis orders a birthday dinner for Room 207 and sends his wrapped music box up with it. At 21:00 both leave the kitchen in the dumbwaiter, a service lift with first- and second-floor hatches. The present never reaches the room. Find it before the candles are lit.',
  reliability: 'There is no timer. Witnesses report accurately what they saw, did and measured. What a person says about where they were is a claim, not a fact. Hotel records and logs are accurate and complete for what they cover.',
  rounds: [
    {
      id: 'MB1', act: 'The Music Box', label: 'The hatch', requires: [], evidenceRefs: ['MB-A1', 'MB-B1'],
      title: 'Lighter on arrival', question: 'Where did the present leave the dumbwaiter?',
      options: ['In the kitchen, before it set off', 'At the first-floor hatch', 'At the second-floor pantry'],
      correct: 'At the first-floor hatch',
      evidence: {
        A: { id: 'MB-A1', title: 'Loaded and weighed', source: 'Witness statement · Ruth Adeyemi, kitchen porter', paragraphs: [
          '“At 21:00 I put three things in the dumbwaiter: a soup tureen, a dinner tray and the wrapped present. I weigh every load for the dumbwaiter’s limit. All three together on the kitchen scale came to 14.5 kilograms. On their own, the tureen weighed 5 kilograms and the tray 6.”',
          '“The tureen lid was loose, and soup slopped over the present’s paper as I closed the hatch. I sent it up anyway and meant to ring the pantry.”',
          '“Once the hatch shuts, the kitchen can’t see the car. I don’t know where it stopped or who opened it.”',
          'The kitchen scale reads to the nearest half kilogram.',
        ] },
        B: { id: 'MB-B1', kind: 'maintenance', title: 'The load gauge', source: 'Certified record · Dumbwaiter load drum', paragraphs: [
          'The dumbwaiter marks its load on a paper drum whenever the car stands at a hatch, to the nearest half kilogram. It cannot show what the items were.',
          '21:00 · Kitchen hatch · Departed carrying 14.5 kg.',
          '21:12 · First-floor hatch · Hatch opened at 21:12 and closed at 21:13. Departed carrying 11.0 kg.',
          '21:14 · Second-floor pantry · Arrived carrying 11.0 kg. Emptied to 0 kg at 21:15.',
          'No other hatch opened between 21:00 and 21:30.',
        ] },
      },
      hints: [
        'The porter’s weighing tells you what the present weighed, with a little arithmetic. The gauge tells you where weight left the car.',
        'Take the tureen and the tray away from the full load to find the present’s weight. Then look for the hatch where exactly that much came out.',
        'The present weighed 14.5 − 5 − 6 = 3.5 kg. The car lost 3.5 kg at the first-floor hatch and arrived with 11 kg, just the tureen and tray. The present came out on the first floor.',
      ],
      deduction: 'The present was taken out at the first-floor hatch at 21:12.',
      proof: 'MB-A1 makes the present 14.5 − 5 − 6 = 3.5 kg. MB-B1 shows the car leaving the kitchen with all 14.5 kg, losing 3.5 kg at the first-floor hatch and arriving at the pantry with 11 kg, the tureen and tray alone.',
    },
    {
      id: 'MB2', act: 'The Music Box', label: 'The story', requires: ['MB1'], evidenceRefs: ['MB-A2', 'MB-B2'],
      title: 'Three accounts of 21:12', question: 'Whose account of 21:12 do the records contradict?',
      options: ['Lucy Marsh', 'Bruno Sale', 'Remy Gault'], correct: 'Lucy Marsh',
      evidence: {
        A: { id: 'MB-A2', title: 'Where everyone says they were', source: 'Statements taken by the duty manager, 21:40', paragraphs: [
          'Lucy Marsh, chambermaid: “At 21:12 I was inside Room 105 on the first floor, turning down the bed for the guest. I never went near the dumbwaiter hatch.”',
          'Bruno Sale, pastry chef: “At 21:12 I was on the staff stairs, carrying the birthday cake down from the first-floor cold room. I signed it into the kitchen at the bottom a minute later.”',
          'Remy Gault, waiter: “At 21:12 I was in the second-floor pantry. I’d rung for the dumbwaiter at 21:10, and I waited there until it came.”',
          'Each of them says they saw nobody else at 21:12.',
        ] },
        B: { id: 'MB-B2', kind: 'log', title: 'Rooms, stairs and pantry', source: 'Verified records · Housekeeping sheet, kitchen book, pantry bell', paragraphs: [
          'Housekeeping sheet, Room 105: evening turndown done and initialled at 19:30.',
          'Room 105: the guest chained her door at 21:00 and opened it to nobody until 21:20. She was inside the whole time.',
          'Kitchen book: birthday cake for Room 207 signed in at the foot of the staff stairs at 21:13.',
          'Second-floor pantry bell: dumbwaiter called at 21:10; its arrival acknowledged at the pantry at 21:14.',
          'These records note places and times. They do not record who was speaking to the duty manager.',
        ] },
      },
      hints: [
        'Each person says where they were at 21:12. Test each account against a record of the same place at the same time.',
        'Two accounts fit their records exactly. In the third, the room described could not have had anyone inside it doing that job at 21:12.',
        'Room 105 was turned down at 19:30, and its guest let nobody in between 21:00 and 21:20. Lucy Marsh was not inside Room 105 at 21:12.',
      ],
      deduction: 'Lucy Marsh was not in Room 105 at 21:12, as she claimed.',
      proof: 'MB-A2 has Lucy turning down Room 105 at 21:12. MB-B2 shows that turndown was already done at 19:30 and that the guest kept her chained door shut from 21:00 to 21:20. Bruno’s cake was signed in at 21:13 and Remy’s pantry call and arrival match their records.',
    },
    {
      id: 'MB3', act: 'The Music Box', label: 'The trail', requires: ['MB2'], evidenceRefs: ['MB-A3', 'MB-B3'],
      title: 'Brown drips on the carpet', question: 'Where was the music box taken?',
      options: ['The linen room', 'Room 109', 'The pressing room'], correct: 'The pressing room',
      evidence: {
        A: { id: 'MB-A3', title: 'A trail from the hatch', source: 'Witness statement · Mrs Achebe, guest, Room 105', paragraphs: [
          '“At 21:20 I unchained my door to put my tray out. There were fresh brown drips on the carpet, like soup, starting at the dumbwaiter hatch beside my door.”',
          '“I followed them. They went along the corridor away from my room to the corner and turned left. After the corner I counted the doors on my right-hand side. The drips stopped at the third of them. It was shut, and I didn’t try it.”',
          '“I saw nobody in the corridor.”',
        ] },
        B: { id: 'MB-B3', kind: 'plan', title: 'First-floor service plan', source: 'Certified floor plan and key list · Housekeeping', paragraphs: [
          'From the dumbwaiter hatch beside Room 105, the corridor runs one way only, to a corner. Turning right at the corner leads only to the staff stairs.',
          'After turning left at the corner, the doors on the right-hand side are, in order: the linen room, Room 109, the pressing room. On the left-hand side are Room 108 and then a store cupboard.',
          'The pressing room has an iron, a drying rail and a sink.',
          'The plan names rooms and keys, not who used them.',
        ] },
      },
      hints: [
        'The trail starts at the hatch in your notebook. Follow Mrs Achebe’s directions on the floor plan.',
        'Turn left at the corner and count only the doors on the right-hand side.',
        'The third right-hand door after the left turn is the pressing room.',
      ],
      deduction: 'The music box was carried to the first-floor pressing room.',
      proof: 'MB-A3 follows soup drips from the first-floor hatch, left at the corner, to the third door on the right. MB-B3 makes that door the pressing room; the linen room and Room 109 are the first and second doors.',
    },
  ],
  ending: {
    recovery: 'The duty manager opens the pressing room. Soup-stained paper hangs by the radiator. Lucy stands at the ironing board, folding fresh paper around the unharmed music box. The manager asks why she said she was in the locked Room 105. Lucy sets down the ribbon.',
    note: '“The soup had soaked the paper and was running towards the box. If it went up like that the birthday would be spoiled, so I took it to dry and wrap it again. We are never allowed to touch room service, so when I was asked I said I had been in 105. I am sorry. I was going to carry it up myself.”',
    signature: 'Lucy Marsh · Chambermaid, first floor',
    conclusion: 'The false account gave you a question to ask, not a motive to assume. Lucy finishes the ribbon and carries the present upstairs with the manager. This time reception knows exactly where it is. The candles are still waiting. The Music Box is resolved.',
  },
};
