import dotenv from 'dotenv';
import { db } from '../../lib';
import * as schema from '../../lib/schema';

dotenv.config();

async function seedDatabase(): Promise<void> {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await db.delete(schema.matches);
        await db.delete(schema.users);
        await db.delete(schema.events);
        await db.delete(schema.data);

        console.log('🗑️  Cleared existing data');

        // Seed data table
        const dataEntries = await db.insert(schema.data).values([
            { uniqueIdentifier: 'user001' },
            { uniqueIdentifier: 'user002' },
            { uniqueIdentifier: 'user003' },
            { uniqueIdentifier: 'user004' },
            { uniqueIdentifier: 'user005' },
            { uniqueIdentifier: 'user006' },
            { uniqueIdentifier: 'user007' },
            { uniqueIdentifier: 'user008' },
        ]).returning();

        console.log('📊 Created data entries:', dataEntries.length);

        // Seed users table with realistic examples
        const users = await db.insert(schema.users).values([
            {
                name: 'Sarah Chen',
                uniqueIdentifier: 'user001',
                answers: {
                    name: 'Sarah Chen',
                    technicalDomain: 'web_development',
                    technicalDomainOther: '',
                    tonight: 'I want to learn about modern React patterns and meet other frontend developers',
                    sideProject: 'Building a recipe sharing app with React and Node.js',
                    helpSkill: 'I can help with CSS animations and responsive design',
                    nonSoftware: 'I love hiking and photography'
                }
            },
            {
                name: 'Marcus Rodriguez',
                uniqueIdentifier: 'user002',
                answers: {
                    name: 'Marcus Rodriguez',
                    technicalDomain: 'ai',
                    technicalDomainOther: '',
                    tonight: 'Looking to explore AI/ML opportunities and connect with data scientists',
                    sideProject: 'Developing a machine learning model for predicting stock prices',
                    helpSkill: 'I can help with Python, TensorFlow, and data preprocessing',
                    nonSoftware: 'I enjoy playing guitar and reading sci-fi novels'
                }
            },
            {
                name: 'Priya Patel',
                uniqueIdentifier: 'user003',
                answers: {
                    name: 'Priya Patel',
                    technicalDomain: 'mobile_development',
                    technicalDomainOther: '',
                    tonight: 'Want to discuss mobile app development trends and React Native',
                    sideProject: 'Creating a meditation app for iOS and Android',
                    helpSkill: 'I can help with React Native, iOS development, and UI/UX design',
                    nonSoftware: 'I practice yoga and love cooking Indian cuisine'
                }
            },
            {
                name: 'Alex Thompson',
                uniqueIdentifier: 'user004',
                answers: {
                    name: 'Alex Thompson',
                    technicalDomain: 'devops',
                    technicalDomainOther: '',
                    tonight: 'Interested in cloud infrastructure and CI/CD pipelines',
                    sideProject: 'Building a monitoring dashboard for Kubernetes clusters',
                    helpSkill: 'I can help with Docker, AWS, and infrastructure automation',
                    nonSoftware: 'I enjoy rock climbing and craft beer brewing'
                }
            },
            {
                name: 'Emma Wilson',
                uniqueIdentifier: 'user005',
                answers: {
                    name: 'Emma Wilson',
                    technicalDomain: 'security',
                    technicalDomainOther: '',
                    tonight: 'Want to learn about cybersecurity and ethical hacking',
                    sideProject: 'Developing a password manager with encryption',
                    helpSkill: 'I can help with security best practices and penetration testing',
                    nonSoftware: 'I love playing chess and solving puzzles'
                }
            },
            {
                name: 'David Kim',
                uniqueIdentifier: 'user006',
                answers: {
                    name: 'David Kim',
                    technicalDomain: 'cloud_computing',
                    technicalDomainOther: '',
                    tonight: 'Looking to discuss serverless architecture and microservices',
                    sideProject: 'Building a serverless e-commerce platform',
                    helpSkill: 'I can help with AWS Lambda, serverless frameworks, and API design',
                    nonSoftware: 'I enjoy playing basketball and watching tech documentaries'
                }
            },
            {
                name: 'Lisa Zhang',
                uniqueIdentifier: 'user007',
                answers: {
                    name: 'Lisa Zhang',
                    technicalDomain: 'other',
                    technicalDomainOther: 'Blockchain Development',
                    tonight: 'Want to explore blockchain technology and smart contracts',
                    sideProject: 'Creating a decentralized voting system',
                    helpSkill: 'I can help with Solidity, Web3.js, and blockchain concepts',
                    nonSoftware: 'I love painting and playing the piano'
                }
            },
            {
                name: 'James O\'Connor',
                uniqueIdentifier: 'user008',
                answers: {
                    name: 'James O\'Connor',
                    technicalDomain: 'web_development',
                    technicalDomainOther: '',
                    tonight: 'Looking to learn about full-stack development and modern frameworks',
                    sideProject: 'Building a social media platform for developers',
                    helpSkill: 'I can help with JavaScript, Node.js, and database design',
                    nonSoftware: 'I enjoy playing guitar and hiking in the mountains'
                }
            }
        ]).returning();

        console.log('👥 Created users:', users.length);

        // Seed events table with realistic event structure
        const events = await db.insert(schema.events).values([
            {
                date: '2024-01-15',
                name: 'Dev and Donuts Meetup',
                structure: {
                    timetable: [
                        {
                            title: 'Welcome & Networking',
                            summary: 'Meet fellow developers over coffee and donuts',
                            description: 'Start the evening by connecting with other developers, sharing your projects, and enjoying some delicious donuts.',
                            start: '18:00',
                            end: '18:30'
                        },
                        {
                            title: 'Modern React Patterns',
                            speaker: {
                                name: 'Sarah Chen',
                                image: '/speakers/sarah-chen.jpg'
                            },
                            summary: 'Exploring advanced React patterns and best practices',
                            description: 'Learn about modern React patterns including custom hooks, compound components, and performance optimization techniques.',
                            start: '18:30',
                            end: '19:15'
                        },
                        {
                            title: 'Coffee Break',
                            summary: 'Network and discuss the previous session',
                            description: 'Take a break to network, ask questions, and discuss what you learned.',
                            start: '19:15',
                            end: '19:30'
                        },
                        {
                            title: 'Building APIs with Node.js',
                            speaker: {
                                name: 'Marcus Rodriguez',
                                image: '/speakers/marcus-rodriguez.jpg'
                            },
                            summary: 'Creating robust REST APIs with Express and TypeScript',
                            description: 'Deep dive into building scalable APIs with proper error handling, validation, and documentation.',
                            start: '19:30',
                            end: '20:15'
                        },
                        {
                            title: 'Open Discussion & Networking',
                            summary: 'Continue the conversation and make connections',
                            description: 'Wrap up the evening with open discussion, project sharing, and networking opportunities.',
                            start: '20:15',
                            end: '21:00'
                        }
                    ]
                }
            },
            {
                date: '2024-02-20',
                name: 'Code & Coffee Session',
                structure: {
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
                }
            }
        ]).returning();

        console.log('📅 Created events:', events.length);

        // Seed matches table with realistic connections
        const matches = await db.insert(schema.matches).values([
            {
                userId1: users[0]!.id, // Sarah Chen
                userId2: users[7]!.id, // James O'Connor
                reason: 'Both interested in web development and React. Sarah can help with CSS animations while James can help with full-stack development.'
            },
            {
                userId1: users[1]!.id, // Marcus Rodriguez
                userId2: users[5]!.id, // David Kim
                reason: 'Marcus has AI/ML expertise while David specializes in cloud computing. Perfect for building ML-powered cloud applications.'
            },
            {
                userId1: users[2]!.id, // Priya Patel
                userId2: users[0]!.id, // Sarah Chen
                reason: 'Both work with React ecosystem - Priya with React Native and Sarah with React web. Great for sharing cross-platform knowledge.'
            },
            {
                userId1: users[3]!.id, // Alex Thompson
                userId2: users[5]!.id, // David Kim
                reason: 'DevOps and cloud computing experts. Alex can help with infrastructure while David can help with serverless architecture.'
            },
            {
                userId1: users[4]!.id, // Emma Wilson
                userId2: users[6]!.id, // Lisa Zhang
                reason: 'Security and blockchain experts. Emma can help with security best practices while Lisa can help with blockchain development.'
            },
            {
                userId1: users[0]!.id, // Sarah Chen
                userId2: users[3]!.id, // Alex Thompson
                reason: 'Frontend developer and DevOps engineer. Sarah can help with UI/UX while Alex can help with deployment and infrastructure.'
            }
        ]).returning();

        console.log('🤝 Created matches:', matches.length);

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Data entries: ${dataEntries.length}`);
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Events: ${events.length}`);
        console.log(`   - Matches: ${matches.length}`);

        console.log('\n👥 User Profiles Created:');
        users.forEach(user => {
            const answers = user.answers as any;
            console.log(`   - ${user.name}: ${answers.technicalDomain} developer`);
            console.log(`     Project: ${answers.sideProject}`);
            console.log(`     Can help with: ${answers.helpSkill}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase(); 