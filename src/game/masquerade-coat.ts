import type { CaseDefinition } from './cases';

// Authored content for edition 04 (free). Answers live here only; docs are author-only and never imported.
export const masqueradeCoat: CaseDefinition = {
  id: 'the-masquerade-coat', version: 1, edition: '04', title: 'The Masquerade Coat',
  coverTitle: 'The Masquerade\nCoat', format: 'Short case · 3 deductions',
  hook: 'Every face masked. One coat gone.',
  description: 'At the hotel’s masquerade, a guest’s camel coat leaves the cloakroom with her grandmother’s brooch pinned inside. Three deductions: which ticket was hers, who collected it and where the coat went.',
  duration: 'Length not yet measured by playtests',
  setting: 'Bellweather Hotel · October 1994',
  introLabel: 'A MASQUERADE BALL, 29 OCTOBER 1994', introTitle: 'Behind every mask.',
  endingTitle: 'Still pinned in place.', noteLabel: 'ON THE DRESSING TABLE IN ROOM 316', noteTitle: 'A hurried note',
  introduction: 'Bellweather Hotel ballroom, 29 October 1994: the autumn masquerade. At 22:50 Agnes Hart went to collect her camel coat. Pinned inside its lining was her late grandmother’s silver brooch. The coat was gone. Someone had collected it at 22:40 with her ticket, which she had lost while dancing. Every guest wore a mask all evening. One of you has what people saw. The other has the cloakroom and hotel records. Find the coat before the last guests go home.',
  reliability: 'There is no timer. Witnesses are accurate about what they directly saw and say plainly what they did not. The cloakroom book, the steward’s mask check and the lift log are complete for what they cover. Masks hid every face, so nobody can be identified by sight.',
  rounds: [
    {
      id: 'MC1', act: 'The Masquerade Coat', label: 'The ticket', requires: [], evidenceRefs: ['MC-A1', 'MC-B1'],
      title: 'A number in the book', question: 'Which ticket number was Agnes Hart given?',
      options: ['34', '35', '36'], correct: '35',
      evidence: {
        A: { id: 'MC-A1', title: 'The guest who lost her ticket', source: 'Witness statement · Agnes Hart, 22:55', paragraphs: [
          '“I came into the cloakroom immediately behind four musicians carrying instrument cases. Nobody was between us. They handed over their coats together, then I handed over mine and was given one ticket.”',
          '“I never looked at the number. I tucked the ticket into my glove and lost it while dancing.”',
          '“My coat is camel wool, plain and knee length. My grandmother’s silver brooch is pinned inside the lining, where nobody would see it.”',
        ] },
        B: { id: 'MC-B1', kind: 'access', title: 'The cloakroom ticket book', source: 'Verified record · Cloakroom stubs', paragraphs: [
          'Tickets are issued one per coat, in strict number order, as each coat is handed over. Tonight no number was skipped or issued twice.',
          '31, 32, 33, 34 · Issued together at 19:20 to the string quartet · Four dark overcoats.',
          '35 · Issued at 19:21 · Plain camel coat.',
          '36 · Issued at 19:24 · Plain camel coat.',
          '37 · Issued at 19:30 · Black velvet cape.',
          'Holders’ names are not recorded. The two plain camel coats look identical on the rail.',
        ] },
      },
      hints: [
        'Agnes knows who handed over coats just before her. The ticket book knows the order the numbers went out.',
        'Tickets go out in strict order, so the coat handed over right after a group gets the next number. Two camel coats came in; only one followed the group directly.',
        'The quartet took 31 to 34 together and Agnes was immediately behind them, so her ticket was the next number: 35.',
      ],
      deduction: 'Agnes Hart’s coat was ticket 35.',
      proof: 'MC-A1 puts Agnes immediately after the four musicians, with nobody between. MC-B1 issues 31 to 34 to the quartet and 35, a plain camel coat, next. 36 is the other camel coat, handed over three minutes later; 34 was one of the musicians’.',
    },
    {
      id: 'MC2', act: 'The Masquerade Coat', label: 'The collector', requires: ['MC1'], evidenceRefs: ['MC-A2', 'MC-B2'],
      title: 'The queue at the rope', question: 'Who handed in ticket 35 at 22:40?',
      options: ['Dr Quinn', 'Ms Ferreira', 'Mrs Lind', 'Mr Pell'], correct: 'Mrs Lind',
      evidence: {
        A: { id: 'MC-A2', title: 'Five masks in a line', source: 'Witness statement · Jun Park, cloakroom attendant', paragraphs: [
          '“At 22:40 there was a short queue at the cloakroom rope, everyone masked. The person who handed me ticket 35 was standing directly behind someone in a fox mask and directly in front of someone whose mask was covered in feathers. I gave them the camel coat from hook 35.”',
          '“I couldn’t see faces and I don’t know names. The queue stayed in the same order the whole time, and everyone in it collected one coat.”',
          'The front of the queue is the end nearest the counter. “Directly behind” someone means the very next person further from the counter.',
        ] },
        B: { id: 'MC-B2', kind: 'access', title: 'The 22:40 mask check', source: 'Verified record · Masquerade committee steward', paragraphs: [
          'At 22:40 the steward checked every masked guest in the cloakroom queue against the invitation list, writing the queue down from the counter backwards. Nobody joined or left the queue afterwards.',
          '1 · Dr Quinn · Red fox mask, painted, no feathers.',
          '2 · Ms Ferreira · Swan mask, feathered.',
          '3 · Mr Okafor · Silver fox mask, painted, no feathers.',
          '4 · Mrs Lind · Raven mask, feathered.',
          '5 · Mr Pell · Owl mask, feathered.',
          'No two guests wore the same mask design. Mrs Lind wore the only raven mask at the ball. The check does not record who held which ticket.',
        ] },
      },
      hints: [
        'The ticket number is in your notebook. The attendant describes the masks on either side of whoever handed it in; the steward has the whole queue in order.',
        'Two people stood directly behind a fox mask. Look at who stood directly behind each of those two.',
        'Ms Ferreira and Mrs Lind each stood directly behind a fox. Behind Ms Ferreira was another fox; behind Mrs Lind was the feathered owl. Mrs Lind handed in ticket 35.',
      ],
      deduction: 'Mrs Lind, in the raven mask, collected the coat with ticket 35.',
      proof: 'MC-A2 places the holder of 35 directly behind a fox and directly in front of a feathered mask. In MC-B2’s queue only Mrs Lind, fourth, has a fox (Mr Okafor) in front and a feathered owl (Mr Pell) behind. Ms Ferreira has a fox behind her, Dr Quinn has nobody in front and Mr Pell has nobody behind.',
    },
    {
      id: 'MC3', act: 'The Masquerade Coat', label: 'The coat', requires: ['MC2'], evidenceRefs: ['MC-B2', 'MC-A3', 'MC-B3'],
      title: 'Up in the lift', question: 'Where did Mrs Lind take the coat?',
      options: ['Room 108', 'Room 316', 'Room 412'], correct: 'Room 316',
      evidence: {
        A: { id: 'MC-A3', title: 'The lift attendant', source: 'Witness statement · Sam Achter, lift attendant', paragraphs: [
          '“At 22:46 a guest in a raven mask stepped into my lift at the ballroom level with a plain camel coat over her arm. Two other guests got in with her.”',
          '“I went straight up, stopping wherever anyone had asked and opening the doors each time. She stepped out at the second stop. I didn’t see which way she turned or which door she used.”',
          '“I didn’t write the floors down. I only remember the order.”',
        ] },
        B: { id: 'MC-B3', kind: 'access', title: 'Lift log and room keys', source: 'Verified record · Lift indicator log and reception register', paragraphs: [
          'Lift 1 left the ballroom level, the ground floor, at 22:46 going up. It stopped at the first floor, then the third floor, then the fourth floor, then came back down. It made no other stops.',
          'Mrs Lind and her sister share one booking of two rooms: Room 108 on the first floor and Room 316 on the third floor. Both keys were with the Lind party all evening.',
          'Room 412, on the fourth floor, is the Hart suite. It stayed locked; its only key was at reception until Agnes Hart collected it at 23:00.',
          'A room number begins with its floor. The log does not record who got out where.',
        ] },
      },
      hints: [
        'You know who wore the raven mask. The attendant remembers the order of the stops; the lift log remembers the floors.',
        'Count the stops in the log in order. Then look for a room on that floor that the raven mask’s party could open.',
        'The second stop was the third floor, and the Lind party’s room there is 316. Mrs Lind took the coat to Room 316.',
      ],
      deduction: 'Mrs Lind took the coat up to Room 316.',
      proof: 'MC-B2 makes the raven mask Mrs Lind’s. MC-A3 has her leave the lift at its second stop, and MC-B3 makes that the third floor, where the Lind party holds Room 316. Room 108 was the first stop, and Room 412 was locked with its key at reception.',
    },
  ],
  ending: {
    recovery: 'A housekeeper lets you into Room 316. A plain camel coat lies across the bed. Inside the lining the silver brooch is still pinned in place. On the dressing table, beside a raven mask, lie a ticket marked 35 and a hurried note.',
    note: '“I found this ticket on the floor by the punch bowl and was certain it was the one I had dropped. Our coats must be twins. I only felt the brooch when I hung the coat up, and I was about to bring it down and find its owner. My own coat must still be on its hook, number 36. Please forgive me.”',
    signature: 'Margaret Lind · Room 316',
    conclusion: 'The note confirms it was a mistake. Before it, you had established the ticket, the collector and the room, not her reason. Agnes has her coat and her grandmother’s brooch, Mrs Lind collects her own coat from hook 36, and the dancing goes on until one. The Masquerade Coat is resolved.',
  },
};
