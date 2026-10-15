import type { CaseDefinition } from './cases';

// Authored content for edition 03. Answers live here only; docs are author-only and never imported.
export const silentPiano: CaseDefinition = {
  id: 'the-silent-piano', version: 1, edition: '03', title: 'The Silent Piano',
  coverTitle: 'The Silent\nPiano', format: 'Short case · 3 deductions',
  hook: 'A premiere cancelled. A page gone missing.',
  description: 'The ballroom piano falls silent minutes before a premiere, and the last page of the score vanishes. Three deductions: how it was silenced, who did it and where the page went.',
  duration: '10–15 minutes · UNVALIDATED',
  setting: 'Bellweather Hotel · October 1994',
  introLabel: 'A RECITAL EVENING IN OCTOBER, 1994', introTitle: 'Nothing will play.',
  introduction: 'Bellweather Hotel ballroom, 25 October 1994. Pianist Tomas Reyes was to premiere his “Waltz for a Closed Room” at nine. At 20:40 he sat down and the grand piano made no sound, and the recital was cancelled. The final page of his score is gone from the music desk. Three people had a reason to be near the piano tonight. One of you has the witness accounts. The other has the hotel’s records. Find out what happened before the audience leaves.',
  reliability: 'There is no timer. Witnesses are accurate about what they directly observed and say plainly what they did not see. Maker’s charts, door and equipment logs and the backstage plan are certified and complete. A job title, an object carried or a motive is not proof of an action on its own.',
  rounds: [
    {
      id: 'SP1', act: 'The Silent Piano', label: 'The silence', requires: [], evidenceRefs: ['SP-A1', 'SP-B1'],
      title: 'Keys that make no sound', question: 'How was the piano silenced?',
      options: ['A felt strip laid across the strings', 'The action was wedged locked', 'The dampers were clipped down'],
      correct: 'A felt strip laid across the strings',
      evidence: {
        A: { id: 'SP-A1', title: 'The pianist at the keyboard', source: 'Witness statement · Tomas Reyes, 20:40', paragraphs: [
          '“I sat down at 20:40 and pressed the keys. Every key moved freely and came back up normally, like any other night. Nothing sounded at all.”',
          '“The lid was raised. I pressed the sustain pedal and watched inside: the dampers lifted off the strings exactly as they should.”',
          '“I did not look at what lay on the strings, and I cannot say what is wrong with it. I only know what I felt and saw.”',
        ] },
        B: { id: 'SP-B1', kind: 'maintenance', title: 'Why a grand piano falls silent', source: 'Certified maker’s service chart · Ballroom grand', paragraphs: [
          'These are the only three conditions that leave this piano silent in the hall. Each is listed with what a player sees.',
          'Felt strip across the strings · Keys move freely · Dampers lift when the sustain pedal is pressed.',
          'Action wedged locked · Keys resist or will not go down · Dampers lift when the sustain pedal is pressed.',
          'Dampers clipped down · Keys move freely · Dampers do not lift when the sustain pedal is pressed.',
          'The chart says what each condition looks like. It does not say which one applies to tonight’s piano.',
        ] },
      },
      hints: [
        'Match what the pianist felt and saw with what each condition looks like on the chart.',
        'Free keys leave two conditions; lifting dampers leave a different two. Find the one that appears in both lists.',
        'The keys moved freely and the dampers lifted. Only the felt strip across the strings shows both.',
      ],
      deduction: 'A felt strip across the strings silenced the piano.',
      proof: 'SP-A1 reports freely moving keys and dampers that lifted. SP-B1 lists free keys for the strip or the clips, and lifting dampers for the strip or the wedged action. Only the felt strip satisfies both.',
    },
    {
      id: 'SP2', act: 'The Silent Piano', label: 'The hands', requires: ['SP1'], evidenceRefs: ['SP-A2', 'SP-B2'],
      title: 'Two people near the lid', question: 'Who silenced the piano?',
      options: ['Ines Calder', 'Hugo Lang', 'Marguerite Doyle'], correct: 'Ines Calder',
      evidence: {
        A: { id: 'SP-A2', title: 'Watching from the wings', source: 'Witness statement · Petra Voss, page-turner', paragraphs: [
          '“The piano rang clearly at 20:05 when Tomas finished warming up. I watched it from the wings without looking away until 20:25.”',
          '“At 20:09 two people were beside the piano. Only one of them reached inside the raised lid. The strings were touched once between 20:05 and 20:25, at 20:09, by that one person. The lid was lowered afterwards.”',
          '“I saw only backs. I could not see faces, and I could not see what the person held. Being near the piano is not the same as reaching inside it.”',
        ] },
        B: { id: 'SP-B2', kind: 'access', title: 'Ballroom door and equipment log', source: 'Certified record · Duty security clerk', paragraphs: [
          'The ballroom was locked from 20:25 until Tomas entered at 20:38. No one else entered or left it in that period.',
          'Each person below was inspected on entering. These are verified times near the piano and the only items each carried; nobody carried anything unlisted or swapped items.',
          'Ines Calder, tuner · Near the piano 19:55 to 20:10 · Carried a felt strip.',
          'Hugo Lang, stage manager · Near the piano 20:08 to 20:20 · Carried wooden wedges.',
          'Marguerite Doyle, events manager · Near the piano 20:12 to 20:25 · Carried small spring clips.',
          'The log does not say who reached inside the lid, or what was done there.',
        ] },
      },
      hints: [
        'Use what silenced the piano, which is already in your notebook, together with who was near it at 20:09.',
        'Check who was near the piano at 20:09, then look at what each of them carried. Two people were there; one carried the wrong kind of item.',
        'Ines and Hugo were both near the piano at 20:09; Marguerite arrived at 20:12. A felt strip was the cause, and only Ines carried one. Hugo carried wedges.',
      ],
      deduction: 'Ines Calder laid the felt strip across the strings.',
      proof: 'SP-A2 narrows the lid to a single person at 20:09 with two people nearby. SP-B2 places only Ines and Hugo there; Marguerite arrived at 20:12. The confirmed cause is a felt strip, which only Ines carried; Hugo carried wedges.',
    },
    {
      id: 'SP3', act: 'The Silent Piano', label: 'The page', requires: ['SP2'], evidenceRefs: ['SP-A3', 'SP-B3'],
      title: 'Down the stage-right corridor', question: 'Where did she take the missing last page?',
      options: ['The prop store', 'The green room', 'The instrument cupboard'], correct: 'The prop store',
      evidence: {
        A: { id: 'SP-A3', title: 'The porter in the corridor', source: 'Witness statement · Lewis Ash, porter', paragraphs: [
          '“Two people left the ballroom through the stage-right door between 20:10 and 20:12. The first carried a flat paper folder. The second had empty hands. I could not see either face.”',
          '“I followed the first one down the corridor. They went through a door with a brass handle and climbed exactly three steps. Then the door closed and I saw nothing more.”',
          '“I did not see inside, and I did not see what was in the folder. I did not follow the second person at all.”',
        ] },
        B: { id: 'SP-B3', kind: 'storage', title: 'The exit log and backstage plan', source: 'Certified exit log and floor plan · Facilities desk', paragraphs: [
          'Exit log, stage-right door: Ines Calder left at 20:10. Hugo Lang left at 20:11. No one else used that door between 20:05 and 20:25.',
          'The rooms reached from the stage-right corridor are listed in full. There are no hidden rooms.',
          'Prop store · Brass handle · Three steps up.',
          'Green room · Brass handle · Five steps up.',
          'Instrument cupboard · Iron handle · Three steps up.',
          'The plan names the rooms, not who entered them or what they carried.',
        ] },
      },
      hints: [
        'Work out which of the two people leaving the ballroom the porter followed. Then use the door and the steps together.',
        'The first to leave was the person you identified. A brass handle leaves two rooms; three steps leaves a different two.',
        'The first to leave was Ines. Brass handle plus three steps up matches only the prop store.',
      ],
      deduction: 'Ines carried the folder to the prop store.',
      proof: 'SP-B3 shows the first person through the stage-right door was Ines, so SP-A3’s folder and route are hers. A brass handle and exactly three steps leave only the prop store; the green room has five steps and the cupboard has an iron handle.',
    },
  ],
  ending: {
    recovery: 'The prop-store door has a brass handle. You climb three steps and find a flat folder on a shelf, sealed with tape. Inside is the last page of the score, unharmed. Beside it sits a folded note.',
    note: '“I did not want the piano broken, only quiet. The closing theme of Tomas’s waltz is my late teacher’s, never published, and the programme gives him no credit. I silenced the piano so I could ask for one before it was played. I took the page so it would not be lost. Please give it back to him, and ask him to name my teacher.”',
    signature: 'Ines Calder · Bellweather Hotel, 25 October 1994',
    conclusion: 'The note confirms why Ines did it. Before it, you had established her actions and the page’s hiding place, not her reason. The page goes back to Tomas, the felt strip comes off the strings, and the recital can be rescheduled with the programme corrected. The Silent Piano is resolved.',
  },
};
