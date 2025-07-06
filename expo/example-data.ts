import { EventStructure, } from "@/components/TimeTable";

export const exampleEventStructure: EventStructure = {
    "timetable": [
        {
            "start": "17:45",
            "end": "18:00",
            "title": "Einlass",
            "summary": "Ankunft und Registrierung der Teilnehmer",
            "description": "Herzlich willkommen! Nutzen Sie diese Zeit, um anzukommen, sich zu registrieren und die ersten Kontakte zu knüpfen."
        },
        {
            "start": "18:00",
            "end": "18:20",
            "title": "Opening & Smalltalk",
            "summary": "Begrüßung und Einstimmung auf den Abend",
            "description": "Offizielle Begrüßung der Teilnehmer und eine kurze Einführung in das Programm des Abends. Zeit für erste Gespräche und Networking."
        },
        {
            "start": "18:20",
            "end": "18:55",
            "title": "From the dream of a long lasting software architecture",
            "summary": "Strebst du auch ständig danach, dein Softwareprojekt stabiler und fehlerfreier zu machen?",
            "description": "Strebst du auch ständig danach, dein Softwareprojekt stabiler und fehlerfreier zu machen? Wir alle wissen, dass dieses Ideal in der Praxis oft schwer zu erreichen ist. Aber es gibt drei einfache Methoden, die dir helfen können, eine klare und stabile Architektur zu erstellen. In diesem Vortrag spricht Christian über „Immutabilität“, „Fail-Fast“-Ansätze und den Aufbau von „Log Stories“.\n\n\nChristian ist Head of Technology bei der Shopware-Agentur dasistweb GmbH und nebenbei Inhaber der Live Score GmbH, die sich auf Scoreboard-Playout-Software spezialisiert hat. Seine Leidenschaft gilt der Software-Architektur, Automatisierung, Integration und Qualitätssicherung. Christian legt großen Wert darauf, effektive Testpraktiken für Entwickler*innen zu etablieren und die Zusammenarbeit zwischen QA und Entwicklung zu verbessern, um eine Testkultur zu schaffen.",
            "speaker": {
                "name": "Christian Dangl",
                "image": "https://yasoon.de/wp-content/uploads/2023/05/Inkognito.png"
            }
        },
        {
            "start": "18:55",
            "end": "19:20",
            "title": "Pause & Speeddating",
            "summary": "Networking-Pause mit Speed-Dating-Format",
            "description": "Eine entspannte Pause mit der Möglichkeit, in kurzen Speed-Dating-Runden neue Kontakte zu knüpfen und sich mit anderen Entwicklern auszutauschen. Perfekt für Networking und den Austausch von Ideen."
        },
        {
            "start": "19:20",
            "end": "20:00",
            "title": "Another talk",
            "summary": "Vortrag von Julia Kordick",
            "description": "Ein inspirierender Vortrag von Julia Kordick. Weitere Details folgen in Kürze."
        },
        {
            "start": "20:00",
            "end": "21:00",
            "title": "Get together",
            "summary": "Gemeinsamer Ausklang des Abends",
            "description": "Lassen Sie den Abend bei Getränken und Snacks gemütlich ausklingen. Vertiefen Sie die geknüpften Kontakte und tauschen Sie sich weiter über Entwicklungsthemen aus."
        }
    ]
};