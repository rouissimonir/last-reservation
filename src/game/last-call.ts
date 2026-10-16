import type { CaseDefinition } from './cases';

// Authored content for edition 07, After Midnight Collection. Answers live here only; docs are author-only.
export const lastCall: CaseDefinition = {
  id: 'the-last-call', version: 1, edition: '07', title: 'The Last Call at Midnight',
  coverTitle: 'The Last Call\nat Midnight', format: 'After Midnight · 5 deductions',
  hook: 'One call. Thirty-five seconds. Then silence.',
  description: 'At midnight the switchboard takes a call from a bellboy who cannot get out, and the line goes dead. Read the hotel as a map of sounds, doors and sightlines to find out where he is, what shut him in and why nobody saw him.',
  duration: 'Length not yet measured by playtests',
  setting: 'Bellweather Hotel · November 1994',
  introLabel: 'AFTER MIDNIGHT · 12 NOVEMBER 1994', introTitle: 'Then the line went dead.',
  endingTitle: 'The door opens.', noteLabel: 'IN THE NIGHT ROUND BOOK', noteTitle: 'An entry made at 00:40',
  introduction: 'Bellweather Hotel, 12 November 1994, 00:20. At midnight the night operator, Ruth Okoye, took an internal call. A young voice said, “Ruth, it’s Teddy. I’m shut in. The door won’t open and it’s pitch dark—” and the line went dead. Teddy Marsh, the sixteen-year-old bellboy, is missing from his post. The hotel has forty house telephones, and the switchboard shows only which group of lines rang. One of you has what people heard and saw tonight. The other has the hotel’s plans, registers and logs. Find Teddy, and work out what shut him in.',
  reliability: 'There is no timer. Witnesses are accurate about what they directly saw and heard and say what they could not see. Plans, registers and logs are certified and complete for what they cover. A guess about why someone acted is not evidence of it.',
  rounds: [
    {
      id: 'LC1', act: 'Part I · A voice on line C', label: 'The telephone', requires: [], evidenceRefs: ['LC-A1', 'LC-B1'],
      title: 'Sounds behind a voice', question: 'Which telephone was Teddy calling from?',
      options: ['The wine cellar', 'The boiler room', 'The laundry', 'The roof plant room'], correct: 'The roof plant room',
      evidence: {
        A: { id: 'LC-A1', title: 'The operator’s call sheet', source: 'Witness notes · Ruth Okoye, night operator, written at 00:01', paragraphs: [
          '“00:00. Lamp lit on line group C. Teddy’s voice, frightened but clear. Under it, water dripping steadily, like a tap into a tin tray.”',
          '“Twice during the call a deep rumble started, ran for a few seconds and stopped, like heavy machinery turning over. Between the two rumbles it was quiet apart from the dripping.”',
          '“I heard no bell of any kind, no other voices and no traffic. My timer started the call at 00:00:05, and it was still going for a while after the second rumble stopped.”',
        ] },
        B: { id: 'LC-B1', kind: 'maintenance', title: 'Line group C', source: 'Certified services register · Engineer’s office', paragraphs: [
          'Line group C serves the four house telephones in the service areas, and only these.',
          'Wine cellar, basement · Water drips from the vaults all year. No machinery of any kind.',
          'Boiler room, basement · The boilers rumble without a break all night. Dry: no dripping water.',
          'Laundry, basement · The sink drains drip. Its machines are off after 22:00. The service-lift bell rings in the laundry each time the service lift arrives, as it did at 00:00:12.',
          'Roof plant room, roof · The water tank drips into its tin tray. The winding gear for the passenger lift rumbles while that lift is moving and is silent when it stands still.',
          'Passenger lift log: moving from 00:00:08 to 00:00:16 and from 00:00:22 to 00:00:31; standing still otherwise between 23:59 and 00:01.',
        ] },
      },
      hints: [
        'Ruth heard two kinds of sound, and she is sure of one sound she did not hear. Check each telephone on group C against all three.',
        'Dripping water rules out one room. A rumble that starts and stops rules out another. The missing bell rules out a third.',
        'Only the roof plant room has dripping water and a rumble that runs only while the lift moves, and the lift moved twice during the call. Teddy called from the roof plant room.',
      ],
      deduction: 'Teddy called from the house telephone in the roof plant room.',
      proof: 'LC-A1 hears steady dripping and two rumbles that start and stop, and no bell. In LC-B1 the boiler room is dry and rumbles without a break, the wine cellar has no machinery, and the laundry’s bell rang during the call. The plant room drips and its winding gear ran exactly twice while the lift moved.',
    },
    {
      id: 'LC2', act: 'Part I · A voice on line C', label: 'The door', requires: ['LC1'], evidenceRefs: ['LC-A2', 'LC-B2'],
      title: 'A door with no handle', question: 'What shut Teddy in?',
      options: ['Someone locked the door with a key', 'A gust of wind swung the door shut', 'Someone removed its wedge and the door latched itself', 'Teddy jammed the latch from inside'],
      correct: 'Someone removed its wedge and the door latched itself',
      evidence: {
        A: { id: 'LC-A2', title: 'From the window of Room 605', source: 'Witness statement · Dr Silas Penrose, guest, Room 605', paragraphs: [
          '“My balcony looks straight across the flat roof to the plant room, and its outside lamp was on. At about a quarter to twelve the plant-room door stood wide open, held by a rubber wedge, with no light inside.”',
          '“A few minutes later a figure with a torch came across the roof to the plant room, bent down at the foot of the door and straightened up. The door swung shut. The figure went straight back the way it came. I saw no key, but I was too far away to be sure there wasn’t one.”',
          '“The air was perfectly still. I was out on my balcony with my telescope all evening, and my observing notes say no wind at all.”',
        ] },
        B: { id: 'LC-B2', kind: 'maintenance', title: 'The plant-room door', source: 'Certified maintenance file · Ticket 114', paragraphs: [
          'Plant-room door: heavy steel on an automatic closer. Held by its wedge it stays open. Remove the wedge, or let a strong gust swing it, and the closer pulls it shut within seconds; it latches as it closes.',
          'The door has no keyhole on either side and cannot be locked with a key. From outside it opens by its handle.',
          'Inside lever removed on 9 November for repair (ticket 114) and not yet refitted. From inside, the latch cannot be reached or worked.',
          'The file records how the door works, not who used it tonight.',
        ] },
      },
      hints: [
        'One of you knows how this door works. The other knows what was seen at it and what the weather was doing.',
        'One explanation is impossible for this door, one is ruled out by the night itself and one is impossible from inside.',
        'The door has no keyhole, its inside lever is off and the night was still. Someone took the wedge away and the closer shut and latched the door with Teddy inside.',
      ],
      deduction: 'Someone took the wedge away, and the door closed and latched with Teddy inside.',
      proof: 'LC-A2 sees a figure bend at the foot of the wedged door just before it swings shut, on a night with no wind. LC-B2 shows the door has no keyhole, closes and latches by itself once unwedged, and cannot be worked from inside with its lever removed.',
    },
    {
      id: 'LC3', act: 'Part II · The roof door', label: 'The hand', requires: ['LC2'], evidenceRefs: ['LC-A2', 'LC-A3', 'LC-B3'],
      title: 'Up the roof stairs', question: 'Who took the wedge away?',
      options: ['Carl Brandt', 'Mara Vale', 'Dr Penrose', 'Teddy Marsh'], correct: 'Carl Brandt',
      evidence: {
        A: { id: 'LC-A3', title: 'The top of the service stairs', source: 'Witness statement · Vera Lund, guest, Room 604', paragraphs: [
          '“Our door faces the top of the service stairs. At about ten to twelve I opened it to put our shoes out and stood chatting with my husband in the doorway for a good quarter of an hour.”',
          '“In that time one person came up the stairs with a torch, unlocked the roof door and went through. A few minutes later the same person came back through it and went down the stairs.”',
          '“They wore a long dark coat with the hood up. I couldn’t see a face, and I honestly couldn’t say whether it was a man or a woman. Nobody else used that door while I was there.”',
        ] },
        B: { id: 'LC-B3', kind: 'access', title: 'The roof door', source: 'Certified logs · Roof-door counter; night manager’s key safe', paragraphs: [
          'The roof door, at the top of the service stairs, locks itself when it closes. From the stairs it opens only with a roof key. From the roof it opens by its push bar.',
          'Roof-door counter: opened at 23:41, 23:53 and 23:56. Not opened since.',
          'Roof key 1 · Signed out at 23:40 by Teddy Marsh, “to fetch Dr Penrose’s telescope case from the plant room.” Not returned.',
          'Roof key 2 · The spare, kept in the night manager’s key safe · Handed to Carl Brandt, night engineer, in person at 23:52 for his midnight round, and handed back by him at 00:10. The safe holds no other roof key.',
          'Switchboard log: Mara Vale, night manager, was at the front desk without a break from 23:30 to 00:30.',
          'There are no other roof keys and no other way onto the roof.',
        ] },
      },
      hints: [
        'Work out who could open the roof door from the stairs just before midnight, and compare that with what was seen at the top of those stairs.',
        'One roof key was already up there with its holder, who ended up on the wrong side of the plant-room door. The other was signed out a minute before the roof door next opened.',
        'Teddy went up at 23:41 and was inside the plant room when it closed. Carl signed out the spare at 23:52, and the roof door opened at 23:53 and 23:56, matching the hooded person Mrs Lund saw go up and come back. Carl took the wedge away.',
      ],
      deduction: 'Carl Brandt, the night engineer, took the wedge away on his midnight round.',
      proof: 'LC-A2 shows the wedge removed from outside, by someone who came across the roof and went back; Teddy was inside. LC-A3 sees one hooded person unlock the roof door from the stairs and return minutes later, and nobody else use it. LC-B3 shows that needed a roof key, that Teddy had key 1 on the roof and that Carl signed out the only other key at 23:52, a minute before the door opened at 23:53 and again at 23:56.',
    },
    {
      id: 'LC4', act: 'Part II · The roof door', label: 'The blind spot', requires: ['LC3'], evidenceRefs: ['LC-A4', 'LC-B4'],
      title: 'Out of the torchlight', question: 'Where was Teddy when the door closed?',
      options: ['Just inside the doorway', 'Beside the winding gear', 'Behind the water tank, at the shelves', 'Out on the open roof'],
      correct: 'Behind the water tank, at the shelves',
      evidence: {
        A: { id: 'LC-A4', title: 'What the torch showed', source: 'Witness statements · Carl Brandt, night engineer; Mara Vale, night manager', paragraphs: [
          'Carl: “On my round the plant-room door was wedged open and dark inside. I stood on the threshold and swept my torch over everything I could see from there. Nobody. I called out once over the noise of the gear and heard nothing back, so I bent down, pulled the wedge out, as I always do, and let it close.”',
          'Carl: “I didn’t go inside. I never do on the round.”',
          'Mara: “When Teddy took the key at 23:40 he told me his torch batteries were nearly flat. He’d never been up there before and asked me where the plant-room light was; I didn’t know.”',
        ] },
        B: { id: 'LC-B4', kind: 'plan', title: 'Inside the plant room', source: 'Certified plan · Engineer’s office; guest property book', paragraphs: [
          'The plant room is one room. From its threshold a torch reaches the floor just inside the door, the winding gear to the left and the front of the water tank straight ahead.',
          'The tank fills the middle of the room from floor to ceiling. The shelves behind it, against the far wall, cannot be seen from the threshold at all.',
          'The plant room’s inside light is switched only from outside, beside the door handle. It was off.',
          'Guest property book: Dr Penrose’s telescope case, left for safe keeping at 15:00, on the shelves behind the tank.',
          'The plan shows what can be seen from where, not who was standing anywhere.',
        ] },
      },
      hints: [
        'Carl says what he searched from where he stood. The plan says what can and cannot be seen from that spot.',
        'Everything a torch can reach from the threshold was empty. One part of the room cannot be seen from there at all. You also know which side of the door Teddy ended up on.',
        'From the threshold a torch reaches the floor by the door, the winding gear and the front of the tank, and all were empty. Teddy was behind the tank, at the shelves where Dr Penrose’s case was kept.',
      ],
      deduction: 'Teddy was behind the water tank, at the shelves, out of sight of the doorway.',
      proof: 'LC-A4 has Carl sweep everything visible from the threshold and see nobody. LC-B4 makes that the floor by the door, the winding gear and the front of the tank, leaving only the shelves behind the tank, where the telescope case was kept. Teddy was shut inside, so he was not out on the roof.',
    },
    {
      id: 'LC5', act: 'Part III · Thirty-five seconds', label: 'The silence', requires: ['LC4'], evidenceRefs: ['LC-A5', 'LC-B5'],
      title: 'Thirty-five seconds', question: 'Why did the line go dead?',
      options: ['Teddy hung up', 'Carl switched off the roof circuit on his round', 'Someone cut the telephone wire', 'The switchboard failed'],
      correct: 'Carl switched off the roof circuit on his round',
      evidence: {
        A: { id: 'LC-A5', title: 'The end of the call', source: 'Witness notes · Ruth Okoye, night operator', paragraphs: [
          '“The call lasted thirty-five seconds by my switchboard timer, starting at 00:00:05.”',
          '“It didn’t click the way a line does when a receiver goes down. It hummed, faded and went dead.”',
          '“My board kept working perfectly. I put two more calls through before twenty past twelve.”',
        ] },
        B: { id: 'LC-B5', kind: 'log', title: 'The midnight round', source: 'Certified round sheet · Night engineer; telephone engineer’s check', paragraphs: [
          'Midnight round, signed C. Brandt: 23:53, roof, plant-room wedge removed and door let close. 00:00:40, sixth-floor distribution board: roof circuit switched off, as every night.',
          'The roof circuit feeds the lamp over the roof door, the outside lamp over the plant-room door and the line amplifier for the plant-room telephone. With the circuit off, that telephone goes dead. No other line is affected.',
          'Telephone engineer’s check at 00:15: the plant-room wire is intact from end to end.',
        ] },
      },
      hints: [
        'Ruth knows exactly how long the call lasted and how it ended. The round sheet knows what else happened that minute.',
        'Add the call’s length to its start time. Then see what was switched at that moment.',
        'The call ran from 00:00:05 for thirty-five seconds, to 00:00:40, and faded instead of clicking. At 00:00:40 Carl switched off the roof circuit, which feeds the plant-room line; the wire was intact and the board kept working.',
      ],
      deduction: 'The line died at 00:00:40, when Carl switched off the roof circuit on his round.',
      proof: 'LC-A5 ends the call at 00:00:05 plus thirty-five seconds, 00:00:40, with a fade rather than a click, and the switchboard kept working. LC-B5 switches off the roof circuit, which powers the plant-room line, at exactly 00:00:40, and finds the wire intact.',
    },
  ],
  ending: {
    recovery: 'You climb to the roof with Carl and Ruth. Carl pulls the plant-room door open by its outside handle. Behind the water tank, Teddy blinks into the torchlight, cold and stiff, holding Dr Penrose’s telescope case. He is unhurt. Carl switches the roof circuit back on, and in the round book on the sixth-floor landing he writes an entry before anyone asks him to.',
    note: '“00:40. Closed the plant-room door at 23:53 without seeing T. Marsh behind the tank; my torch could not reach him. Switched off the roof circuit at midnight as usual, not knowing he was on the telephone. My fault, not the boy’s. From tonight: look behind the tank, call twice, and never close that door again until its inside lever is back.”',
    signature: 'Carl Brandt · Night engineer',
    conclusion: 'Carl’s entry confirms it was a mistake. Before it, you had established where Teddy was, what shut him in, whose hand took the wedge away, why he was not seen and why the line died, but not what Carl knew. Teddy goes down to a mug of tea at the switchboard, Dr Penrose has his case, and the inside lever is refitted by breakfast. The Last Call at Midnight is resolved.',
  },
};
