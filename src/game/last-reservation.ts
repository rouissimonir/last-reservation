import type { CaseDefinition } from './cases';

export const lastReservation: CaseDefinition = {
  id: 'the-last-reservation', version: 1, edition: '02', title: 'The Last Reservation',
  coverTitle: 'The Last\nReservation', format: 'Full case · 3 acts',
  hook: 'A missing visitor. An appointment erased.',
  description: 'A visitor disappears before your meeting. Her reservation has been replaced by a cancellation. Follow the paper trail before the hotel changes hands.',
  duration: '30–45 minutes · UNVALIDATED',
  introduction: 'Bellweather Hotel, 18 October 1994, 22:00. Elin Ward asked you to witness a reservation before the hotel’s sale. She promised to meet you at ten. Now the lobby is empty and reception says she cancelled. Find the visitor—and the record someone wants forgotten.',
  reliability: 'It is 22:00 in this collected account; there is no timer. Direct witness observations are accurate within their stated limits. Certified access, authentication and sealed-carbon records are reliable. The current appointment page is disputed; a quoted claim or suspicion is not automatically true. Use the supplied evidence, not guesses about guilt.',
  rounds: [
    {
      id: 'LR1', act: 'Act I · An appointment erased', label: 'The appointment', requires: [], evidenceRefs: ['LR-A1', 'LR-B1'],
      title: 'A name left at reception', question: 'Which appointment name did Elin Ward use?',
      options: ['Ada Finch', 'Ruth Vane', 'Elsie North'], correct: 'Ruth Vane',
      evidence: {
        A: { id: 'LR-A1', title: 'The visitor at the brass lamp', source: 'Witness statement · Guest investigator, 21:20', paragraphs: [
          '“She introduced herself to us as Elin Ward. I remember her green brooch because it caught the light. She asked the receptionist for reservation folio 72, repeating both digits until the receptionist nodded.”',
          '“She said she was a visitor, not an overnight guest: ‘I need two independent people to see a reservation before a sale goes through. Meet me here at ten.’ She went towards reception, but I could not read the appointment name.”',
          'You watched the same visitor throughout that exchange. Neither she nor her brooch changed.',
        ] },
        B: { id: 'LR-B1', kind: 'access', title: 'Three appointments', source: 'Certified carbon · Reception, filed 21:10', paragraphs: [
          'The sealed carbon records all three visitor appointments this evening. Mara Vale noted a visible brooch and requested folio beside each appointment name. The carbon predates the disputed current page.',
          'Ada Finch · Green brooch · Requested folio 27.',
          'Ruth Vane · Green brooch · Requested folio 72.',
          'Elsie North · Silver brooch · Requested folio 72.',
          'Each row is a distinct visitor. No other appointments or identity exchanges occurred. True names were not recorded.',
        ] },
      },
      hints: ['Compare the two details observed together with the appointment carbon.', 'A green brooch leaves Ada or Ruth. Folio 72 leaves Ruth or Elsie. Find the intersection.', 'The same visitor had a green brooch and requested folio 72. Only Ruth Vane matches both; that is Elin’s appointment name.'],
      deduction: 'Elin used the appointment name Ruth Vane.',
      proof: 'LR-A1 identifies Elin through her introduction, green brooch and folio-72 request. LR-B1 has one row matching both details: Ruth Vane. Ada requested 27; Elsie wore silver.',
    },
    {
      id: 'LR2', act: 'Act I · An appointment erased', label: 'The route', requires: ['LR1'], evidenceRefs: ['LR-A2', 'LR-B2'],
      title: 'Beyond the public rooms', question: 'Which route did Elin take at 21:36?',
      options: ['West staff corridor', 'Conservatory', 'East archive passage'], correct: 'East archive passage',
      evidence: {
        A: { id: 'LR-A2', title: 'A bell behind frosted glass', source: 'Witness statement · Lounge attendant', paragraphs: [
          '“At 21:36 a member of staff addressed the visitor as Ruth Vane. She answered, gathered her papers and followed that person away from reception. I watched the same visitor all the way to the door; nobody took her place.”',
          '“The door was glazed with frosted glass. When they opened it, its bell sounded one clear note. I heard the whole opening and closing: there was no second note.”',
          '“I could not read the door plaque. I did not hear an argument or see anyone seize her, but that does not tell me why she went. Reception later said she had cancelled; I did not see a cancellation.”',
        ] },
        B: { id: 'LR-B2', kind: 'maintenance', title: 'Public-door survey', source: 'Certified maintenance survey · Three lobby exits', paragraphs: [
          'These are the only service/public doors leading out of the reception recess. Their fittings were inspected before and after 21:36 and did not change.',
          'West staff corridor · Solid wooden door · Single-note bell.',
          'Conservatory · Frosted-glass door · Two-note bell.',
          'East archive passage · Frosted-glass door · Single-note bell.',
          'There are no concealed exits. The survey records fittings, not who used the doors.',
        ] },
      },
      hints: ['Use the appointment name already in your notebook. Then compare both observed door features.', 'A single bell could be west or east. A glazed door could be the conservatory or east.', 'Ruth Vane is Elin. The glazed, single-note door uniquely leads to the east archive passage.'],
      deduction: 'At 21:36 Elin followed a guide into the east archive passage.',
      proof: 'The confirmed alias links LR-A2’s named visitor to Elin. The continuous observation supplies glazed glass and a single-note bell; LR-B2 maps that pair only to the east archive passage.',
    },
    {
      id: 'LR3', act: 'Act II · The altered ledger', label: 'The guide', requires: ['LR2'], evidenceRefs: ['LR-A3', 'LR-B3'],
      title: 'Four people with access', question: 'Who guided Elin along the route you identified?',
      options: ['Mara Vale', 'Owen Bell', 'Victor Hale', 'Celia Rook'], correct: 'Owen Bell',
      evidence: {
        A: { id: 'LR-A3', title: 'The guide’s yellow cord', source: 'Witness statement · Corridor attendant', paragraphs: [
          '“I saw the same continuous escort described by the lounge attendant at 21:36. The guide wore a yellow lanyard. I watched that guide from the reception recess through the door; there was no handover or exchange of lanyards.”',
          '“The visitor followed carrying her own papers. I could not see the guide’s face clearly, so I will not identify anyone by a guess. I heard the guide say, ‘The carbon is kept through here.’”',
          '“Mara runs reception; Owen carries deliveries; Victor owns the hotel; Celia keeps its archive.”',
        ] },
        B: { id: 'LR-B3', kind: 'access', title: 'The 21:36 access check', source: 'Certified observation log · Duty security clerk', paragraphs: [
          'Verified positions at 21:36, not planned shifts. These observations cover all four relevant staff.',
          'Mara Vale · Red lanyard · East archive route.',
          'Owen Bell · Yellow lanyard · East archive route.',
          'Victor Hale · Yellow lanyard · West office.',
          'Celia Rook · Red lanyard · Conservatory.',
          'No identities, lanyards or positions were exchanged during the escort. Nobody else entered the route.',
        ] },
      },
      hints: ['Combine the route in your notebook with the guide’s lanyard, rather than suspecting someone because of their job.', 'Yellow fits Owen and Victor. The east route fits Mara and Owen at 21:36.', 'Only Owen Bell matches both the confirmed east archive route and the observed yellow lanyard. This establishes the escort, not wrongdoing.'],
      deduction: 'Owen Bell was Elin’s guide into the archive passage.',
      proof: 'LR-A3 describes the same uninterrupted escort and a yellow lanyard. LR-B3 places only Mara and Owen on the confirmed east route, with only Owen wearing yellow. Victor’s yellow lanyard is insufficient because he was west.',
    },
    {
      id: 'LR4', act: 'Act II · The altered ledger', label: 'The substitution', requires: ['LR3'], evidenceRefs: ['LR-A4', 'LR-B4'],
      title: 'The cancellation that wasn’t', question: 'Who deliberately substituted the cancelled reservation page?',
      options: ['Owen Bell', 'Celia Rook', 'Victor Hale'], correct: 'Victor Hale',
      evidence: {
        A: { id: 'LR-A4', title: 'A call from badge V17', source: 'Witness transcript · Telephone operator, 21:45', paragraphs: [
          '“The caller gave badge V17. I wrote down the words as they were spoken: ‘I replaced her 72 with the cancelled 27. Tell them she cancelled. The buyer must believe every room is empty.’”',
          '“I asked whether the visitor herself had cancelled. The caller said, ‘Just pass on what I told you.’ I passed the words to reception, but I did not see the visitor cancel anything.”',
          'The operator records the badge, not a recognized voice. The transcript is exact; the caller’s claims must be tested against the carbon.',
        ] },
        B: { id: 'LR-B4', kind: 'access', title: 'The sealed carbon and the sale', source: 'Certified original and personal-call log', paragraphs: [
          'The clerk observed Victor Hale personally place the badge-V17 call at 21:45. No one borrowed the badge or used the line for him. Owen Bell and Celia Rook did not place that call.',
          'The original carbon shows folio 72 as a live occupied reservation, with no cancellation. Folio 27 is an unrelated cancelled reservation. The current page under Elin’s appointment instead presents the cancelled 27.',
          'Victor’s signed buyer declaration, prepared at 20:50, states that every room is empty. Its payment condition requires that statement to be true. The live reservation contradicts the declaration.',
        ] },
      },
      hints: ['Do not confuse the person who escorted Elin with the person who altered the page. Identify the caller.', 'The operator has exact words but no name. The personal-call log supplies the name, and the carbon tests the cancellation claim.', 'Victor personally made call V17 and admitted replacing live folio 72 with cancelled 27 so the buyer would believe the hotel empty. The carbon verifies that this was a false substitution.'],
      deduction: 'Victor deliberately replaced live folio 72 with cancelled folio 27.',
      proof: 'LR-A4 records V17’s explicit admission and deceptive instruction. LR-B4 independently attributes that personal call to Victor and establishes the original live/cancelled pages. This proves document substitution, not abduction.',
    },
    {
      id: 'LR5', act: 'Act III · A visitor found', label: 'The retreat', requires: ['LR4'], evidenceRefs: ['LR-A5', 'LR-B5'],
      title: 'A room away from reception', question: 'Which room did Elin choose after leaving the archive?',
      options: ['West parcel room', 'East music room', 'West staff reading room'], correct: 'West staff reading room',
      evidence: {
        A: { id: 'LR-A5', title: 'The westward turn', source: 'Witness statements · Mara Vale and Owen Bell', paragraphs: [
          'Mara: “At 21:52 I saw Elin choose the west service branch and climb exactly one floor from the lobby level. I watched her take that route herself. I cannot name the room at its end.”',
          'Owen: “She had asked for somewhere quiet. At 21:58 I took tea along that same west branch and up one floor to the same visitor. She opened the door from inside. I did not take a key away or order her to remain.”',
          'Mara: “When she missed the public meeting, I feared someone had forced her out. That was my worry, not something I saw.”',
          'The accounts describe her route. Mara’s fear is not an observation.',
        ] },
        B: { id: 'LR-B5', kind: 'storage', title: 'The service-wing destinations', source: 'Certified floor plan · Facilities desk', paragraphs: [
          'Lobby level is the ground floor. One floor above it is the first floor. The following destinations exhaust the accessible rooms at the ends of the relevant west/east service branches; there are no hidden connecting rooms.',
          'West parcel room · West service branch · Ground floor.',
          'East music room · East service branch · First floor.',
          'West staff reading room · West service branch · First floor.',
        ] },
      },
      hints: ['Describe the route using both branch and number of floors climbed. Keep observations separate from Mara’s fear.', 'The parcel room is west but on the ground floor. The music room is one floor up but east.', 'West service branch plus exactly one floor up identifies the west staff reading room.'],
      deduction: 'Elin chose the west staff reading room.',
      proof: 'LR-A5 supplies a westward route and a climb of one floor, corroborated by the tea delivery. LR-B5 uniquely maps west/first floor to the staff reading room. The parcel and music rooms each fail one condition.',
    },
    {
      id: 'LR6', act: 'Act III · A visitor found', label: 'The reconstruction', requires: ['LR5'], evidenceRefs: ['LR-A6', 'LR-B6'],
      title: 'Words worth trusting', question: 'Which explanation is supported by message W6 and its custody record?',
      options: ['Elin withdrew voluntarily to wait for the police to collect the originals', 'A forged message conceals Elin’s detention', 'Elin withdrew voluntarily to protect originals and await witnesses'],
      correct: 'Elin withdrew voluntarily to protect originals and await witnesses',
      evidence: {
        A: { id: 'LR-A6', kind: 'letter', title: 'Message W6', source: 'Message text · Claimed signature E.W., 21:59', paragraphs: [
          '“Please tell the two guests I am waiting in the room where Owen brought tea. I chose to leave the public rooms. I can leave this room whenever I want. I am keeping the original occupancy sheets here until independent witnesses arrive.”',
          '“The false cancellation should not erase a guest who was here. Owen helped me reach the archive; he has not detained me. I did not ask Victor or anyone else to change the reservation page. We need copies witnessed before these papers go back downstairs.”',
          'The text ends “E.W.” and carries reference W6. The words supply an explanation only if the message’s authorship can be trusted. A signature by itself is not proof that Elin wrote it.',
        ] },
        B: { id: 'LR-B6', kind: 'letter', title: 'Authorship and the inside release', source: 'Certified custody note and facilities inspection', paragraphs: [
          'Celia Rook verified Elin Ward’s identity against her press card at 21:05. At 21:59 Celia personally watched that same Elin write and sign document W6 in full. The document was sealed immediately; its custody is intact. This note authenticates authorship, without reproducing the message’s words.',
          'A facilities inspection confirms the west staff reading-room door has a working free interior release. Its occupant can leave without a staff key. Owen’s 21:58 tea delivery log records the door opening from inside.',
          'Custody and the door inspection are independently verified. This record does not reproduce W6’s contents.',
        ] },
      },
      hints: ['One role has the message’s words. The other can establish who wrote them. Test both the authorship and the stated plan.', 'Authentic words can distinguish two voluntary plans; a plausible plan alone cannot rule out a forgery.', 'B6 verifies Elin wrote W6. A6 says she is protecting originals until independent witnesses arrive, not waiting for police collection. Together they establish her voluntary plan.'],
      deduction: 'Elin withdrew voluntarily to protect originals and await witnesses.',
      proof: 'LR-A6 contains the first-person account; LR-B6 independently authenticates Elin as its author and corroborates freedom to leave. The combined evidence supports her stated voluntary plan. Earlier escort/access evidence alone did not establish this motive.',
    },
  ],
  ending: {
    recovery: 'You follow the west service branch and climb one floor. Elin opens the staff reading-room door herself. The tea has gone cold beside a stack of original occupancy sheets. She is safe, and she has been waiting for the two of you.',
    note: '“I booked under another name so the buyer wouldn’t hear a reporter was coming. That reservation was real. I wanted witnesses to copies, not another rumour. Will you both sign that you have seen the originals?”',
    signature: 'Elin Ward · Bellweather Hotel, 18 October 1994',
    conclusion: 'You witness the copies and return a sealed set to Mara for preservation. Elin can challenge the false vacancy declaration with the original carbon and Victor’s attributed admission. Owen’s escort was assistance, not proof of abduction; Celia’s custody record made the final message trustworthy. A visitor who vanished from the lobby has been found, and a reservation someone tried to erase is on record again. The Last Reservation is resolved.',
  },
};
