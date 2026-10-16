import type { CaseDefinition } from './cases';

// Authored content for edition 08, After Midnight Collection. Answers live here only; docs are author-only.
export const portraitBehindWall: CaseDefinition = {
  id: 'the-portrait-behind-the-wall', version: 1, edition: '08', title: 'The Portrait Behind the Wall',
  coverTitle: 'The Portrait\nBehind the Wall', format: 'After Midnight · 5 deductions',
  hook: 'Someone rewrote her life. The wall kept the original.',
  description: 'A portrait hidden behind a wall contradicts the hotel’s official history. Old letters and the paper beneath their words hold a different story.',
  duration: 'Length not yet measured by playtests',
  setting: 'Bellweather Hotel · November 1994',
  introLabel: 'AFTER MIDNIGHT · 20 NOVEMBER 1994', introTitle: 'A face in the wall.',
  endingTitle: 'Let the wall keep it.', noteLabel: 'TUCKED INSIDE THE FRAME', noteTitle: 'A note in a heavy, careful hand',
  introduction: 'Bellweather Hotel, 20 November 1994, 01:30. Behind a panel in the closed writing room, restorers find a portrait and three letters. Guest June Reed believes the sitter was her grandmother. The hotel’s 1939 history says the founder’s daughter, Clara, gave up the man she loved and stayed home. Archivist Celia Rook brings out the letter used to prove it. Compare the documents with the archive. Which story survives?',
  reliability: 'There is no timer. The restorer describes only what he can see and measure; he does not judge dates. The archive records are certified and complete for what they cover. A date written on a document is a claim. The paper, print and machine it was made with are evidence. What a living person remembers being told is a claim until something supports it.',
  rounds: [
    {
      id: 'PB1', act: 'Part I · Four documents', label: 'The paper', requires: [], evidenceRefs: ['PB-A1', 'PB-B1'],
      title: 'Paper that remembers', question: 'Which document could not have been written on the date it bears?',
      options: ['Letter A, from J. to C.', 'Letter B, from C. to J.', 'Letter C, to the joiners', 'Letter D, from Clara to her father'],
      correct: 'Letter D, from Clara to her father',
      evidence: {
        A: { id: 'PB-A1', kind: 'statement', title: 'Four documents under the lamp', source: 'Restorer’s notes · Tobias Wren, 01:50', paragraphs: [
          'Letter A, from the alcove · Handwritten in ink, signed “J.”, dated 14 February 1934. Printed letterhead: “Bellweather Hotel · Telephone: Bellweather 12”. Watermark, held to the lamp: CRANE & LISLE, with a small star.',
          'Letter B, from the alcove · Handwritten in ink, signed “C.”, dated 2 September 1935. Letterhead: “Telephone: Bellweather 12”. Watermark: CRANE & LISLE, with a small crescent.',
          'Letter C, from the alcove · Typed, signed “A. Bellweather”, dated 6 January 1936. Letterhead: “Telephone: Bellweather 12”. Watermark: CRANE & LISLE, with a small crescent.',
          'Letter D, from the archive file for the 1939 history · Typed, signed “Clara” in ink, dated 3 May 1933. Plain sheet, no letterhead. Watermark: CRANE & LISLE, with a small anchor.',
          'Letter D reads: “Father, I have given up Jonah. I shall stay here as you wish. Clara.” The history presents it as her original letter, not a later copy.',
          'I record what is on each sheet. I make no judgement about when any of them was written.',
        ] },
        B: { id: 'PB-B1', kind: 'archive', title: 'Paper and print', source: 'Certified records · Hotel stationery accounts, 1920–1946', paragraphs: [
          'The hotel bought all its writing paper from Crane & Lisle, a new stock every January. Each year’s paper carries a small year mark in its watermark: a bell for 1932, a key for 1933, a star for 1934, a crescent for 1935, a crown for 1936, a leaf for 1937, an anchor for 1938 and a ship for 1939.',
          'Paper can be written on in any later year. It cannot be written on before the year it was made.',
          'Letterhead “Telephone: Bellweather 12”: printed until December 1935; the last sheets were used up in March 1936. Letterhead “Telephone: Bellweather 412”: from April 1936.',
          'Plain unprinted sheets were kept for private letters by the family.',
        ] },
      },
      hints: [
        'Each document has a date someone wrote on it and marks the restorer measured. The archive dates those marks.',
        'Paper can be used any time after it was made, never before. Check every watermark and every letterhead against the date on the same sheet.',
        'Letter D is dated 1933, but its anchor watermark means paper made in 1938. It cannot be what it claims. Letter C is on older paper and letterhead, which is allowed.',
      ],
      deduction: 'Letter D, the letter quoted in the official history, is on paper made in 1938, five years after its date.',
      proof: 'PB-A1 gives each sheet’s date, watermark mark and letterhead. PB-B1 makes the star 1934, the crescent 1935 and the anchor 1938, and keeps the “Bellweather 12” letterhead in use until March 1936. Letters A and B match their years; Letter C, January 1936, is on 1935 paper and old letterhead, which is possible. Letter D, dated May 1933, is on 1938 paper.',
    },
    {
      id: 'PB2', act: 'Part I · Four documents', label: 'The sitter', requires: [], evidenceRefs: ['PB-A2', 'PB-B2'],
      title: 'A woman in green', question: 'Who is the woman in the portrait?',
      options: ['Clara Bellweather', 'Cora Byrne', 'Constance Ash'], correct: 'Clara Bellweather',
      evidence: {
        A: { id: 'PB-A2', kind: 'statement', title: 'The portrait and two letters', source: 'Restorer’s notes and transcriptions · Tobias Wren', paragraphs: [
          'Portrait · Oil on canvas, 60 by 45 centimetres. A young woman in a green dress sits at a writing desk beneath a round window with a star-shaped glazing bar. On the back of the canvas, in brush: “C., painted for her by J. R., 1934.” No other name appears on canvas or frame.',
          'Letter A, transcribed in full: “My dear C., one more sitting and the portrait is finished. Come to the alcove on Thursday while your father is in town; the round window gives the best light in the house. He must never know that you sit for me in his own writing room. J.”',
          'Letter B, transcribed in full: “J., I have told him. He says that if I marry you I am no daughter of his, and that your picture will never hang in this house. I don’t care. I will meet you at the Halt. C.”',
        ] },
        B: { id: 'PB-B2', kind: 'archive', title: 'Who was here in 1934', source: 'Certified records · Staff and family register; building survey', paragraphs: [
          'Everyone living or working at the hotel in 1934 whose name began with C:',
          'Clara Bellweather, born 1912 · Daughter of the founder, Ambrose Bellweather.',
          'Cora Byrne, chambermaid · Daughter of a fisherman in the town.',
          'Constance Ash, bookkeeper · Daughter of the hotel’s head chef.',
          'The writing room was Ambrose Bellweather’s private study from 1902 until 1936. Its alcove, with the hotel’s only round window and star-shaped glazing bar, was panelled over in 1936.',
          'J. R.: Jonah Reed, painter, engaged to paint the dining-room murals from 1933 to August 1935.',
        ] },
      },
      hints: [
        'The canvas gives an initial. The letters say whose room she was painted in; the register says whose room that was.',
        'Three people at the hotel in 1934 had a name beginning with C. Only one had a father who could call the writing room his own.',
        'The portrait was painted in the alcove of “your father’s own writing room”, which was Ambrose Bellweather’s study. The only C. whose father was Ambrose is Clara Bellweather.',
      ],
      deduction: 'The woman in the portrait is Clara Bellweather, painted by Jonah Reed in 1934.',
      proof: 'PB-A2 shows a sitter called C. under a round window, painted by J. R. in 1934, and Letter A places the sittings in the alcove of C.’s father’s writing room. PB-B2 makes that window unique to the writing room, the writing room Ambrose Bellweather’s study and his daughter the only C. he fathered. Cora’s and Constance’s fathers had no claim on the room.',
    },
    {
      id: 'PB3', act: 'Part II · The alcove', label: 'The wall', requires: ['PB2'], evidenceRefs: ['PB-A3', 'PB-B3'],
      title: 'Behind the panel', question: 'When was the alcove sealed?',
      options: ['In February 1936', 'In March 1936, before the job was signed off', 'After the job was signed off in 1936', 'In 1939, when the history was written'],
      correct: 'In March 1936, before the job was signed off',
      evidence: {
        A: { id: 'PB-A3', kind: 'statement', title: 'The cavity', source: 'Restorer’s notes · Tobias Wren, with the night plasterers', paragraphs: [
          'The alcove was closed by one panel nailed to battens. It had never been taken down before tonight: the paint across its joints was unbroken and the original nails had rusted in place.',
          'The back of the panel was lined with a whole sheet of the local newspaper, pasted on before the panel went up. Its masthead reads: The Bellweather Gazette, Monday 2 March 1936.',
          'Pencilled on a batten in carpenter’s capitals: “ALCOVE · MOTT & SONS · JOB 211”.',
        ] },
        B: { id: 'PB-B3', kind: 'archive', title: 'Mott & Sons, job 211', source: 'Certified records · Joiners’ invoice; hotel works diary', paragraphs: [
          'Job 211, the writing room, ordered by A. Bellweather on 6 January 1936: panel over the alcove.',
          'Work began on 10 February 1936 and was signed off complete on 20 March 1936.',
          'Mott & Sons did no other work in the writing room, before or after.',
          'The invoice records the dates of the job, not the day each panel went up.',
        ] },
      },
      hints: [
        'The joiners’ records give the span of the job. Something stuck to the back of the panel tells you the earliest day this panel could have gone up.',
        'A newspaper cannot be pasted behind a panel before it was printed. And this panel was never taken down again.',
        'The lining is dated 2 March 1936, and job 211 was finished on 20 March 1936. The panel never came down until tonight, so the alcove was sealed between 2 and 20 March 1936.',
      ],
      deduction: 'The alcove was sealed between 2 and 20 March 1936 and not opened again until tonight.',
      proof: 'PB-A3 shows the panel was lined with the Gazette of 2 March 1936 before it went up and was never removed afterwards, and ties it to job 211. PB-B3 completes job 211 on 20 March 1936. February is too early for the newspaper; April and 1939 are after the job was finished, and the panel was never reopened.',
    },
    {
      id: 'PB4', act: 'Part II · The alcove', label: 'The typist', requires: ['PB1', 'PB3'], evidenceRefs: ['PB-A1', 'PB-A4', 'PB-B4'],
      title: 'Two machines', question: 'Who typed Letter D?',
      options: ['Ambrose Bellweather', 'Clara Bellweather', 'Edith Marlow', 'Jonah Reed'], correct: 'Ambrose Bellweather',
      evidence: {
        A: { id: 'PB-A4', kind: 'statement', title: 'Under the magnifier', source: 'Restorer’s notes · Tobias Wren, 02:40', paragraphs: [
          'Letters C and D are both typed. In Letter C every character is cleanly formed.',
          'In Letter D, every lower-case “e” has a break at the top of its loop, and every capital “T” sits slightly below the line. Both faults appear every single time those letters are used, so they belong to the machine, not to a slip.',
          'The signature “Clara” on Letter D is in ink, written on top of the finished typing.',
        ] },
        B: { id: 'PB-B4', kind: 'archive', title: 'The office typewriters', source: 'Certified records · Machine inventory, use register and archive receipt', paragraphs: [
          'Typewriter No. 1, front office, 1930 to 1946 · Used by the secretary, Edith Marlow, for all hotel letters. Clean type throughout its life.',
          'Typewriter No. 2, bought October 1938 · Founder’s private rooms. Faults from new: a broken loop at the top of the lower-case “e” and a capital “T” that drops below the line.',
          'The certified use register establishes exclusive operation: Edith Marlow alone used No. 1 and Ambrose Bellweather alone used No. 2 between October 1938 and May 1939. Neither machine was lent or used by a visitor.',
          'Archive receipt, 2 May 1939: Ambrose personally deposited Letter D as Clara’s original 1933 letter. It was sealed then and has not been altered since.',
        ] },
      },
      hints: [
        'Letter D was typed. Match what the magnifier shows to the hotel’s machines, then ask who could reach the machine that matches.',
        'Match both faults to a machine, then check its verified operator during the period before the letter was sealed.',
        'Letter D’s broken “e” and dropped “T” match No. 2. Its only operator from purchase in October 1938 to the sealed deposit in May 1939 was Ambrose Bellweather.',
      ],
      deduction: 'Ambrose typed Letter D on No. 2 between October 1938 and its sealed deposit in May 1939, then presented it as Clara’s original 1933 letter.',
      proof: 'PB-A4’s two faults identify No. 2. PB-B4 bounds the typing between that machine’s October 1938 purchase and the letter’s sealed May 1939 deposit, and verifies Ambrose as its sole operator throughout. The receipt claims a 1933 original; the machine and PB-A1’s 1938 paper disprove that claim. This is not merely a later acknowledged copy.',
    },
    {
      id: 'PB5', act: 'Part III · The story the hotel told', label: 'The truth', requires: ['PB1', 'PB2', 'PB4'], evidenceRefs: ['PB-A2', 'PB-A5', 'PB-B5'],
      title: 'The 7:10 train', question: 'What does the evidence establish about Clara in 1935?',
      options: ['She left on the 7:10 train to visit a relative and did not marry Jonah Reed', 'She left on the 7:10 train to marry Jonah Reed, against her father’s wishes', 'She left on the 7:40 train to marry Jonah Reed, against her father’s wishes', 'She left on the 7:10 coach to marry Jonah Reed, against her father’s wishes'],
      correct: 'She left on the 7:10 train to marry Jonah Reed, against her father’s wishes',
      evidence: {
        A: { id: 'PB-A5', kind: 'statement', title: 'What June brought with her', source: 'Restorer’s transcription · Family document C482; June Reed’s account', paragraphs: [
          'Document C482, original civil marriage certificate: Clara Bellweather and Jonah Reed, married 12 September 1935. Tobias transcribes the names, date and document number from the sheet June brought.',
          'June: “She said her father never forgave her. She kept this certificate beside his photograph, not hidden away. I thought the hotel might tell me why.”',
          'June has no travel ticket. This sheet says nothing about how the couple left Bellweather. The certificate’s authenticity must be checked against the archive’s verification.',
        ] },
        B: { id: 'PB-B5', kind: 'archive', title: 'The departure and the document check', source: 'Certified records · Railway boarding register; civil-registry verification', paragraphs: [
          'Railway boarding register, Saturday 7 September 1935: Clara Bellweather and Jonah Reed personally checked aboard the 7:10 train at Bellweather Halt. This records boarding, not a reservation. Neither took the 7:40 train or the coach.',
          'Civil-registry verification: document C482 is a genuine original marriage certificate, unaltered; its transcribed names and date are accurate. This verification does not reproduce those fields.',
          'The 1939 official history gives one source for the claim that Clara gave up Jonah Reed and stayed: the letter now filed as Letter D. It names no other.',
        ] },
      },
      hints: [
        'Separate the journey from what followed it. One sheet describes a family document; the other verifies it and records the actual departure.',
        'A marriage document does not identify a train. A boarding entry does not establish a marriage. Combine both, then recall the father’s threat in Letter B.',
        'The verified certificate names Clara and Jonah as married on 12 September. The boarding register puts them on the 7:10 train on 7 September. Letter B shows she chose Jonah despite her father’s threat; Letter D’s contrary history is forged.',
      ],
      deduction: 'Clara left on Saturday 7 September 1935, on the 7:10, to marry Jonah Reed against her father’s wishes. The story that she stayed rests on a forgery.',
      proof: 'PB-B5 records actual boarding of the 7:10 on 7 September, not merely a possible service. PB-A5 names Clara and Jonah on marriage certificate C482 dated 12 September; B5 verifies that document. PB-A2’s Letter B supplies their plan against her father’s wishes. A alone cannot select the journey; B alone cannot distinguish marriage from the alternative purpose. Letter D cannot establish that she stayed.',
    },
  ],
  ending: {
    recovery: 'Celia lifts the canvas from the alcove so that June Reed can see it under the work lamps. June touches the round window in the painting and says nothing for a long time. When the restorer eases the backing board from the frame, a folded sheet slips out, written in ink in a heavy, careful hand.',
    note: '“March 1936. She has married her painter and gone, and I told her she was no daughter of mine. I cannot look at this picture, and I cannot burn it. Let the wall keep it. If anyone ever finds her here, tell her I was wrong. Outside this room I am still too proud to say it.”',
    signature: 'Ambrose Bellweather',
    conclusion: 'His private apology stayed behind a wall; his public lie entered the archive three years later. June asks for a copy of the portrait and a corrected caption beneath the original. This time it will name Clara Bellweather and Jonah Reed together. The Portrait Behind the Wall is resolved.',
  },
};
