import React from 'react';
import Layout from './_common/layout.jsx';

const GraduateProgram = () => {
    const steps = [
      { icon: 'one',    title: 'Send us your resume',                                       description: 'Begin your application for our graduate programme by uploading your resume. Be sure to include your contact details. Feel free to emphasise any awards, achievements, projects, and open-source contributions that will make you stand out.' },
      { icon: 'two',    title: 'Phone screening',                                           description: 'If your resume meets our basic requirements, we\'ll call you to get a better picture of who you are and what your interests are.' },
      { icon: 'three',  title: 'Technical test',                                            description: 'If you pass our phone screening, we\'ll invite you to a technical test either on-site or online. Depending on your qualifications and background, you\'ll be asked technical questions, which may require you to write code.' },
      { icon: 'four',   title: 'Self-Assessment Topgrading Interview (SATI) Questionnaire', description: 'Once you\'ve passed our technical test, we\'ll send you a SATI to understand you better.' },
      { icon: 'five',   title: `A Day @ ${it.website_name}`,                                description: `Do well on the SATI and earn yourself a trip to an all-day event at our office in Cyberjaya. This is an opportunity for you to learn more about what we do, experience our culture first-hand, meet potential team members, and ask us questions about life at ${it.website_name}. We’ll also put you through interviews and group exercises to assess your skills and cultural fit.` },
      { icon: 'six',    title: 'Job offer',                                                 description: 'Aced your interviews and made a real impression on us? Congratulations! we\'ll contact you with an official offer to join our graduate programme.' },
    ];

    return (
        <Layout
            meta_description={it.L('[_1] Graduate Programme', it.broker_name)}
            css_files={[
                it.url_for('css/graduate_program.css'),
                'https://style.binary.com/binary.css',
            ]}
            js_files={[
                it.url_for('js/landing_pages/common.js'),
                it.url_for('js/landing_pages/graduate_program.js'),
            ]}
        >
            <div className='navbar-fixed-top' role='navigation' id='navigation'>
                <div className='container'>
                    <div className='navbar-header'>
                        <span id='toggle-menu' href='button' className='navbar-toggle' />
                        <a className='navbar-brand logo' href={it.url_for('home')} />
                    </div>
                    <div className='navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            <li className='invisible'>
                                <a href='#page-top' />
                            </li>
                            <li>
                                <a className='page-scroll' href='#who-we-are'>{('Who we are')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#application-process'>{('Application process')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#teams'>{('Teams')}</a>
                            </li>
                            <li>
                                <a className='page-scroll' href='#programs'>{('Programs')}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section id='page-top' className='intro'>
                <div className='intro-body'>
                    <h1 className='intro-text'>{(`${it.website_name} Graduate Programme`)}</h1>
                    <p className='intro-subtext'>{('Build a successful career at the intersection of finance and technology')}</p>
                </div>
                <div className='intro-bg' />
                <div id='register' className='primary-bg-color-dark section-title-inverse'>
                    <a href='https://goo.gl/forms/GWIuCPurg8D1ZlbR2' target='_blank' rel='noopener noreferrer' className='button'><span>Apply now</span></a>
                </div>
            </section>

            <section id='who-we-are' className='container'>
                <div className='section-title'>
                    <h2>Who we are</h2>
                </div>
                <p><span className='text-bold'>{it.website_name}</span>{(' is an exciting, challenging, and highly rewarding working environment, built on the strengths of our people. We aim to recruit the best of the best and to empower them in their careers so that they can flourish and grow with our business.')}</p>
                <p>{(`As a graduate at ${it.website_name}, you will be given responsibility from Day 1. Through training and development, you will build your existing skills and learn new ones. You will grow into a respected professional who is encouraged to break the norm and push the boundaries of technology and finance.`)}</p>
                <p>{('We offer graduates and undergraduates the opportunity to work in highly-rewarding tech environment with exceptional people.')}</p>
            </section>

            <section className='container'>
                <div className='section-title'>
                    <h2>{('Who we\'re looking for')}</h2>
                </div>
                <div className='gr-row'>
                    <div className='gr-6 gr-12-m'>
                        <div className='box fill-bg-color'>
                            <p>{('The journey that we are on demands the right company. We seek technologists with a passion for their field and a strong will to resolve complex problems.')}</p>
                            <p>{('When faced with a problem that you don\'t immediately have the answer to, your determination and curiosity will drive you to a solution. You are a fast learner, and are open to adapting a wide range of technologies. You work well with others, and can collaborate in a fast-paced environment.')}</p>
                        </div>
                    </div>
                    <div className='separator gr-padding-30 gr-12-m' />
                    <div className='gr-6 gr-12-m'>
                        <h4 className='center-text'><span className='text-bold'>{('Education and experience requirement')}</span></h4>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/education_icon.svg')} />
                            <p>{('A bachelor\'s, master\'s, or PhD in computer science, IT, mathematics, physics, or engineering.')}</p>
                        </div>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/coding_icon.svg')} />
                            <p>{('Experience with any of the following technologies: HTML, CSS, JavaScript, C, C++, Java, Perl, MATLAB, R, and AWS')}</p>
                        </div>
                        <div className='inline-flex'>
                            <img className='icon-md margin-30' src={it.url_for('images/graduate_program/experience_icon.svg')} />
                            <p>{('If currently employed, the candidate must have less than one year\'s worth of working experience.')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='application-process'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('Application process')}</h2>
                </div>
                <div className='container'>
                    <div className='gr-row'>
                        <div className='gr-12'>
                            {steps.map((step, idx) => (
                                <div key={idx} className='boxed-steps'>
                                    <span className={`${step.icon}_icon icon`} />
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id='teams'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('Software development teams')}</h2>
                </div>
                <div id='teams-tab' className='container tab-with-indicator'>
                    <ul className='tab-menu'>
                        <li className='tab'><a href='#frontend'>{('Front-end')}</a></li>
                        <li className='tab'><a href='#backend'>{('Back-end')}</a></li>
                        <li className='tab'><a href='#quants'>{('Quants')}</a></li>
                        <span className='active-tab-indicator' />
                    </ul>
                    <div className='tab-content-wrapper'>
                        <div id='frontend' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Front-End Developer')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Develop and maintain user-facing websites and applications.')}</p>
                                        <p>{('Integrate new features into existing user interfaces.')}</p>
                                        <p>{('Resolve complex technical challenges faced by our suite of platforms.')}</p>
                                        <p>{('Software development stack: HTML, CSS, JavaScript')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/frontend_icon.svg')} />
                                </div>
                            </div>
                        </div>
                        <div id='backend' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Back-End Developer')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Build and manage APIs and product features.')}</p>
                                        <p>{('Scale up data architecture.')}</p>
                                        <p>{('Integrate third-party financial systems.')}</p>
                                        <p>{('Software development stack: Perl, Linux, C++, Chef, Postgres, Redis, AWS, Google Cloud Engine')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/backend_icon.svg')} />
                                </div>
                            </div>
                        </div>
                        <div id='quants' className='tab-content'>
                            <div className='gr-row inline-flex'>
                                <div className='gr-7 gr-12-m'>
                                    <h2>{('Quantitative Developer')}</h2>
                                    <div className='box fill-bg-color'>
                                        <p>{('Manage and optimise pricing and risk management software for exotic options, Forex, and CFDs.')}</p>
                                        <p>{('Develop risk management models and algorithms.')}</p>
                                        <p>{('Develop software to study market micro-structure and manage financial data feeds.')}</p>
                                        <p>{('Software development stack: Perl, R, Python, MATLAB')}</p>
                                    </div>
                                </div>
                                <div className='gr-5 gr-12-m'>
                                    <img className='gr-padding-30 responsive' src={it.url_for('images/graduate_program/quants_icon.svg')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id='programs'>
                <div className='section-title-inverse primary-bg-color'>
                    <h2>{('What\'s in the programme?')}</h2>
                </div>
                <div className='container'>
                    <p>{('Our graduate programme is designed to tap into your true potential, give you deep insights into our business, and provide you with a platform to do amazing work.')}</p>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program1_icon.svg')} />
                        <p>{('We\'ll kick things off with orientation week – a week spent away from the office that\'s all about learning and having fun. You\'ll participate in team building exercises, learn how to navigate your new workplace, and join a mini hackathon where you\'ll get the chance to make pull requests and contribute to our codebase.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program2_icon.svg')} />
                        <p>{('A \'Buddy\' and \'Mentor\' will be assigned to guide you throughout the programme. This will give you the opportunity to take part in pair programming sessions, as well as a friend to guide you throughout.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program3_icon.svg')} />
                        <p>{('You\'ll rotate through the front-end, back-end, and quants team. Each rotation will give you a feel for what each team does on a day-to-day basis while also allowing you to contribute to our codebase. Tasks will be assigned to you in increasing complexity to gradually build your confidence.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program4_icon.svg')} />
                        <p>{('Attend our Software Craftsmanship Workshops – interactive lessons on a wide range of software development topics that will give you a better understanding of our codebase.')}</p>
                    </div>
                    <div className='inline-flex'>
                        <img className='icon-lg margin-left-0' src={it.url_for('images/graduate_program/program5_icon.svg')} />
                        <p>{('At the end of the rotation period, you\'ll move into a full-time position. we\'ll assign you to a team based on your experience during the rotation, your performance on each team, and your personal preferences.')}</p>
                    </div>
                </div>
            </section>

            <footer className='center-text primary-bg-color content-inverse-color'>
                <p>{('Browse all career opportunities at')} <a className='link' target='_blank' href={it.url_for('careers')} >{it.website_name}</a></p>
            </footer>
        </Layout>
    );
};

export default GraduateProgram;
