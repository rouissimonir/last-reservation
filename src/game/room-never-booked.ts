import type { CaseDefinition } from './cases';

// Authored content for edition 06, After Midnight Collection. Answers live here only; docs are author-only.
export const roomNeverBooked: CaseDefinition = {
  id: 'the-room-never-booked', version: 1, edition: '06', title: 'The Room That Was Never Booked',
  coverTitle: 'The Room That\nWas Never Booked', format: 'After Midnight · 5 deductions',
  hook: 'An unsold room. A slept-in bed. No guest at all.',
  description: 'Room 309 was not for sale. At dawn its bed is slept in, two teacups sit on the desk, and its key is still locked away. Find the guest nobody booked.',
  duration: 'Length not yet measured by playtests',
  setting: 'Bellweather Hotel · November 1994',
  introLabel: 'AFTER MIDNIGHT · 5 NOVEMBER 1994', introTitle: 'Somebody slept here.',
  endingTitle: 'Warm, and waiting.', noteLabel: 'ON THE DRYING-ROOM BENCH', noteTitle: 'A note in the porter’s hand',
  introduction: 'Bellweather Hotel, 5 November 1994, 06:30. Room 309 has a broken radiator and no booking. Yet the day housekeeper found its bed slept in and two used teacups on the desk. Its key never left the locked cabinet. The night staff remember fragments: rain, footsteps, a taxi. Rebuild the night and find the missing guest before the morning manager arrives at seven.',
  reliability: 'There is no timer. Witnesses are accurate about what they directly saw or heard and about the order in which things happened to them; most did not look at a clock. Logs record exact times and are complete for what they cover. What a person says about their own movements is a claim until something else supports it.',
  rounds: [
    {
      id: 'RB1', act: 'Part I · The wall of Room 307', label: 'The hour', requires: [], evidenceRefs: ['RB-A1', 'RB-B1'],
      title: 'The door next to mine', question: 'When was Room 309 entered during the night?',
      options: ['Before 00:05', 'Between 00:05 and 00:15', 'After 00:15'], correct: 'Between 00:05 and 00:15',
      evidence: {
        A: { id: 'RB-A1', title: 'Through the wall of Room 307', source: 'Witness statement · Lionel Grey, guest, Room 307', paragraphs: [
          '“I couldn’t sleep. I stayed in my room reading with the door ajar and no clock in sight. First, rain began against my window.”',
          '“Some time after that, two sets of footsteps came along the corridor and stopped next door, at 309. A key turned, the door opened, and it closed again.”',
          '“Some time after that, the lift’s low hum, which I’d heard through the wall all evening, stopped.”',
          '“I can tell you the order I heard things in. I can’t give you a single time.”',
        ] },
        B: { id: 'RB-B1', kind: 'log', title: 'The porch book and the lift log', source: 'Certified logs · Doorman’s weather book; lift log', paragraphs: [
          'Doorman’s weather book, front porch: dry all evening; rain began at 00:05 and fell without a break until 03:00.',
          'Lift log: switched off at the basement panel at 00:15, and on again at 06:00 by its time switch. While it runs, its motor hums faintly through the walls of every guest floor. Switched off, it is silent.',
          'Room 309: out of order since 29 October. Not for sale, no booking, no key issued. The key cabinet’s counter shows it was not opened between 22:00 and 06:00.',
          'These logs do not record who was on any floor.',
        ] },
      },
      hints: [
        'The guest knows the order of what he heard. The logs know when some of those things happened. Pin his sounds to the logs.',
        'Two of the sounds he heard appear in the logs with exact times. The door of 309 closed between them.',
        'Rain began at 00:05 and the lift hum stopped at 00:15. Room 309’s door closed between those two sounds, so it was entered between 00:05 and 00:15.',
      ],
      deduction: 'Room 309 was entered between 00:05 and 00:15.',
      proof: 'RB-A1 places the key, the opening and the closing of 309 after the rain began and before the lift hum stopped. RB-B1 times those two sounds at 00:05 and 00:15.',
    },
    {
      id: 'RB2', act: 'Part I · The wall of Room 307', label: 'The key', requires: ['RB1'], evidenceRefs: ['RB-A2', 'RB-B2'],
      title: 'Two master keys', question: 'Who unlocked Room 309?',
      options: ['Grace Holloway', 'Abel Finch', 'Dora Pike', 'Carl Brandt'], correct: 'Abel Finch',
      evidence: {
        A: { id: 'RB-A2', title: 'A cold radiator in Room 214', source: 'Witness statements · Amara Osei, guest, Room 214; Dora Pike, night chambermaid', paragraphs: [
          'Mrs Osei: “My radiator had gone cold, so I rang down. The chambermaid came to my door with blankets, and while she was standing there the rain began. I remember us both turning to the window.”',
          'Mrs Osei: “She stayed to bleed the radiator, and she was still kneeling beside it when the faint hum in the wall stopped. She never left my room in between. We talked the whole time. Her badge said PIKE.”',
          'Dora Pike: “I stayed in 214 until the radiator was warm. I didn’t go up to the third floor until my linen round at three, and I opened no room then.”',
          'Mrs Osei saw nothing of the corridor or any other floor.',
        ] },
        B: { id: 'RB-B2', kind: 'access', title: 'Who could open 309', source: 'Certified records · Master-key custody; locksmith’s report', paragraphs: [
          'Room 309’s own key never left the locked cabinet. At 06:20 the locksmith found its lock undamaged, with no sign of forcing or picking.',
          'The only other keys that open 309 are the two night master keys, which are kept in the night manager’s office, not in the key cabinet.',
          'Master key 1 · Signed out at 22:00 by Abel Finch, night porter · Returned at 06:05.',
          'Master key 2 · Signed out at 22:00 by Dora Pike, night chambermaid · Returned at 06:05.',
          'The custody record confirms that each master key stayed with and was used only by its named holder all night; there were no loans, exchanges or assisted uses. Numbered seals on both belt chains remained intact. Grace Holloway and Carl Brandt hold no guest-room key.',
        ] },
      },
      hints: [
        'Only certain keys could open 309 last night. Find who held them, then check each holder against the window in your notebook.',
        'Two keys could open the door. One of their holders was with someone else, in another room, from the start of the rain until the hum stopped.',
        'Only Abel Finch and Dora Pike held master keys. Mrs Osei was with Dora from 00:05 to 00:15, the whole window, so Abel unlocked 309.',
      ],
      deduction: 'Abel Finch, the night porter, unlocked Room 309 with his master key.',
      proof: 'RB-B2 verifies exclusive custody and use of the two master keys by Abel and Dora. RB-A2 keeps Dora in Room 214 throughout the confirmed 00:05–00:15 window. She could neither use nor lend her key at 309, leaving Abel as its operator.',
    },
    {
      id: 'RB3', act: 'Part II · A story about a taxi', label: 'The guest', requires: ['RB2'], evidenceRefs: ['RB-A1', 'RB-A2', 'RB-A3', 'RB-B3'],
      title: 'A taxi in the rain', question: 'What became of the young woman who came in just before midnight?',
      options: ['She left by the front doors in a taxi', 'She waited in the lobby until morning', 'She went up to Room 309 with Abel', 'She left through the staff yard'],
      correct: 'She went up to Room 309 with Abel',
      evidence: {
        A: { id: 'RB-A3', title: 'Two accounts of the lobby', source: 'Witness statements · Grace Holloway, night receptionist; Abel Finch, night porter', paragraphs: [
          'Grace: “A few minutes before midnight a young woman came in from the station with a small suitcase, still dry, and asked for a room. I told her we were full, which was true. She said she had four pounds and nowhere to go. Abel sat her by the fire, and I went into the back office to run the night audit. I stayed at the terminal until it finished.”',
          'Grace: “When I came out, the lobby was empty. Later Abel came back alone. From the moment I came out until morning I was at the desk, and nobody else came into the lobby or waited in it.”',
          'Abel: “I sat with her by the fire for a few minutes, then walked her out of the front doors to a taxi, before the rain began. She drove off. I never saw her again.”',
        ] },
        B: { id: 'RB-B3', kind: 'log', title: 'Doors, calls and terminals', source: 'Certified logs · Door counters, switchboard, audit terminal, basement panel', paragraphs: [
          'Front doors: opened at 23:58, when the doorman noted one person coming in with a small suitcase. Not opened again until 06:15.',
          'Staff yard door: alarmed and set all night. It was not opened.',
          'Switchboard: no outside calls and no taxi ordered between 23:30 and 01:00.',
          'Audit terminal, back office: one unbroken session under G. Holloway from 00:04 to 00:14, with keystrokes at least once a minute. Basement panel: one unbroken session under C. Brandt from 23:55 to 00:20. Neither can be left without ending its session.',
          'Guest-room door counters, 23:30 to 00:30: only Room 214 (00:05) and Room 309 (00:08) opened, apart from Room 307’s door, which stood open from 23:40. The 23:30 evening round found every booked guest in their own room.',
        ] },
      },
      hints: [
        'Abel and Grace tell different stories. Test the taxi against the doors and the switchboard. Then work out whose was the second set of footsteps at 309.',
        'Nobody left by any door, and nobody waited in the lobby. Between 00:05 and 00:15 every member of staff and every booked guest is accounted for except two people.',
        'The front doors never opened after 23:58 and no taxi was called, so Abel’s story is false. Grace, Carl, Dora and every booked guest are accounted for. The second set of footsteps at 309 was hers.',
      ],
      deduction: 'The young woman never left the hotel. She went up to Room 309 with Abel.',
      proof: 'RB-B3 shows the front doors unopened after her arrival at 23:58, the yard door shut and no taxi called, so Abel’s account in RB-A3 is false; Grace found the lobby empty and watched it until morning. Of the two sets of footsteps in RB-A1, one was Abel’s. Grace and Carl were held at their terminals, Dora was in 214 (RB-A2) and no guest-room door opened except 214 and 309. Only the traveller is left.',
    },
    {
      id: 'RB4', act: 'Part II · A story about a taxi', label: 'The departure', requires: ['RB3'], evidenceRefs: ['RB-A4', 'RB-B4'],
      title: 'The second door', question: 'When did the young woman leave Room 309?',
      options: ['At 00:41', 'At 03:12', 'At 05:41', 'She was still inside when the housekeeper opened it'],
      correct: 'At 05:41',
      evidence: {
        A: { id: 'RB-A4', title: 'Later that night', source: 'Witness statements · Lionel Grey, Room 307; Grace Holloway, reception', paragraphs: [
          'Mr Grey: “Later, 309’s door opened and closed and one set of footsteps went off towards the service stairs, heavy, like boots. I’m certain only one set went. The lighter steps, a woman’s heels, stayed behind. Then I fell asleep.”',
          'Mr Grey: “I woke when 309’s door opened and closed again, softly, and light steps went away towards the service stairs. Only a few minutes later the telephone rang with the call I had booked.”',
          'Grace: “Abel came back to the desk alone and sat with me until he went to return his key at five past six. We were never apart in all that time.”',
        ] },
        B: { id: 'RB-B4', kind: 'log', title: 'The service stairs', source: 'Certified logs · Stair-door counter; reception and housekeeping notes', paragraphs: [
          'Third-floor service-stair door counter: opened at 00:41, 03:12, 03:15 and 05:41. No other openings between 00:00 and 06:30. Apart from the lift, which was off until 06:00, those stairs are the only way off 309’s corridor.',
          'Linen round, signed D. Pike: came onto the third floor by the service stairs at 03:12, checked the linen cupboard and left the same way at 03:15. She opened no room.',
          'Switchboard: the call booked by Room 307 was rung at 05:45, as booked. It was the only call to Room 307 that night.',
          'Reception desk note: A. Finch back on the desk at 00:45.',
          'Housekeeping: Room 309 unlocked by the day housekeeper at 06:00 and found empty.',
        ] },
      },
      hints: [
        'The guest heard two departures from 309 and counted the footsteps each time. The stair-door counter and the night’s other records tell you when people used those stairs.',
        'Work out who left first and whether she went with them. Then account for every opening of the stair door, and use the guest’s telephone call to place the second departure.',
        'One heavy set left first, at 00:41, and Abel was on the desk with Grace from 00:45 until after six, so she stayed. 03:12 and 03:15 were Dora’s linen round. The light steps came a few minutes before Mr Grey’s 05:45 call: 05:41.',
      ],
      deduction: 'The young woman left Room 309 alone, by the service stairs, at 05:41.',
      proof: 'RB-A4 hears one heavy set leave first while the woman’s steps stay, then light steps leave later. RB-B4 puts Abel at the desk from 00:45, and Grace keeps him there until 06:05, so the 00:41 departure was Abel’s alone. 03:12 and 03:15 were Dora’s round, opening no room. The light steps came just before Mr Grey’s 05:45 call, which fits only 05:41. The room was empty at 06:00.',
    },
    {
      id: 'RB5', act: 'Part III · Below stairs', label: 'The refuge', requires: ['RB4'], evidenceRefs: ['RB-A5', 'RB-B5'],
      title: 'Down the service stairs', question: 'Where will you find her now?',
      options: ['The staff kitchen', 'The laundry', 'The boiler room', 'Gone through the staff yard'], correct: 'The laundry',
      evidence: {
        A: { id: 'RB-A5', title: 'On the basement landing', source: 'Witness statement · Carl Brandt, night engineer', paragraphs: [
          '“At about twenty to six I was up a stepladder on the basement landing, at the foot of the service stairs, changing a bulb with my back to the two basement doors.”',
          '“A young woman in a grey coat, carrying a small suitcase, came down past me from above. She didn’t stop at the ground floor; she came all the way down. She went through one of the two doors behind me. I heard it close, but I didn’t turn round in time to see which.”',
          '“She hasn’t come back past me. I’ve been on this landing ever since, right up until you came down to ask.”',
        ] },
        B: { id: 'RB-B5', kind: 'plan', title: 'The foot of the service stairs', source: 'Certified plan and logs · Facilities desk', paragraphs: [
          'The service stairs have doors on the third floor, on the ground floor (into the staff kitchen) and in the basement, and nowhere else. The basement landing has two doors: the boiler room and the laundry.',
          'Boiler room: locked since 00:20. Carl Brandt holds its only key. Its lock counter shows no use since 00:20.',
          'Laundry: one door and no other way out; its windows are barred. The drying room inside it stays warm all night.',
          'Staff yard door, reached through the kitchen: alarmed and set all night. It was not opened.',
        ] },
      },
      hints: [
        'Your notebook says how she left 309. The engineer saw where she went next, but not through which door.',
        'Of the two basement doors, one could not have been opened by anyone but its keyholder, and its lock was not used.',
        'She went down past the ground floor to the basement. The boiler room has been locked since 00:20 with Carl’s only key, so she went into the laundry, which has no other way out.',
      ],
      deduction: 'She is in the laundry, where she went at about 05:42.',
      proof: 'RB-A5 brings her past the ground floor to the basement and through one of its two doors, and she has not come back. RB-B5 shows the boiler room locked and unused since 00:20 with Carl’s only key, which leaves the laundry, a room with no other way out. The kitchen and the yard were never reached.',
    },
  ],
  ending: {
    recovery: 'You go down the service stairs, past Carl’s ladder, and open the laundry door. In the drying room, among warm sheets, a young woman in a grey coat sits on an upturned basket with her suitcase at her feet. She says her name is Hannah Wells and that she was told to wait here. On the bench beside her lies a note in the porter’s hand, addressed to the morning manager.',
    note: '“Miss Wells missed her connection and had four pounds. Every room we sell was full, so I gave her 309. It is cold, but it has a bed, and I took up a pot of tea. I will pay for the night myself; the money is in an envelope in the till marked 309. I told a story about a taxi so that the trouble would be mine and not Grace’s. She is in the drying room because it is warm. I will walk her to the 07:10 train.”',
    signature: 'Abel Finch · Night porter',
    conclusion: 'The note confirms why Abel did it. Before it, you had established when 309 was opened, whose key opened it, who slept there, when she left and where she went, but not his reason. The envelope is in the till, Hannah catches the 07:10, and the morning manager has a decision to make about a room nobody booked and a porter who paid for it. The Room That Was Never Booked is resolved.',
  },
};
