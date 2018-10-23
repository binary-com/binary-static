import React from 'react';
import { List } from '../../_common/components/elements.jsx';

const InvisibleHeading = ({ headers = [] }) => (
    <div className='center-text' id='title'>
        { headers.map((header, idx) => (
            <h1 className={`${header.className} invisible`} key={idx}>{header.string}</h1>
        ))}
    </div>
);

const UlText = ({ text, paragraph, className, items = [] }) => (
    <React.Fragment>
        <p><strong>{text}</strong></p>
        { paragraph && <p>{paragraph}</p> }
        { items && <List className={className} items={items} /> }
    </React.Fragment>
);

const SideBar = ({ className, sidebar_items = [] }) => (
    <div className={`sidebar invisible ${className}`}>
        <ul id='sidebar-nav'>
            { sidebar_items.map((sidebar_item, idx) => (
                <li key={idx}><a href={`#${sidebar_item.href}`}>{sidebar_item.string}</a></li>
            ))}
        </ul>
    </div>
);

const InvisibleImage = ({ classNames = [] }) => (
    <div className='gr-12 center-text' id='image'>
        { classNames.map((className,idx) => (
            <img className={`responsive invisible dept-image ${className}`} src={it.url_for(`images/pages/careers/${className}.svg`)} key={idx} />
        ))}
    </div>
);

const JobDetails = () => (
    <div className='job-details container'>
        <div className='gr-parent static_full'>
            <div className='gr-row'>
                <div className='gr-3 gr-padding-10 gr-hide-m gr-hide-p'>

                    <InvisibleImage
                        classNames={[
                            'information_technology',
                            'quality_assurance',
                            'quantitative_analysis',
                            'marketing',
                            'accounting',
                            'compliance',
                            'customer_support',
                            'human_resources',
                            'administrator',
                            'internal_audit',
                        ]}
                    />
                    <div className='gr-12 gr-padding-10'>
                        <InvisibleHeading
                            headers={[
                                { className: 'information_technology', string: it.L('Information Technology') },
                                { className: 'quality_assurance',      string: it.L('Quality Assurance') },
                                { className: 'quantitative_analysis',  string: it.L('Quantitative Analysis') },
                                { className: 'marketing',              string: it.L('Marketing') },
                                { className: 'accounting',             string: it.L('Accounting') },
                                { className: 'compliance',             string: it.L('Compliance') },
                                { className: 'customer_support',       string: it.L('Customer Support') },
                                { className: 'human_resources',        string: it.L('Human Resources') },
                                { className: 'administrator',          string: it.L('Administrator') },
                                { className: 'internal_audit',         string: it.L('Internal Audit') },
                            ]}
                        />
                    </div>
                    <div className='gr-12 gr-padding-10 sidebar-container'>
                        <SideBar
                            className='information_technology'
                            sidebar_items={[
                                { href: 'devops_engineer',                     string: it.L('DevOps Engineer') },
                                { href: 'system_administrator',                string: it.L('System Administrator') },
                                { href: 'backend_developer',                   string: it.L('Back-End Developer') },
                                { href: 'frontend_developer',                  string: it.L('Front-End Developer') },
                                { href: 'perl_developer',                      string: it.L('Perl Developer')},
                                { href: 'cryptocurrency_blockchain_developer', string: it.L('Cryptocurrency/Blockchain Developer')},
                                { href: 'security_researcher',                 string: it.L('Security Researcher') },
                                { href: 'ui_ux_designer',                      string: it.L('UI/UX Designer') },
                            ]}
                        />

                        <SideBar
                            className='quantitative_analysis'
                            sidebar_items={[
                                { href: 'quantitative_analyst',   string: it.L('Quantitative Analyst') },
                                { href: 'financial_market_analyst', string: it.L('Financial Market Analyst') },
                            ]}
                        />

                        <SideBar
                            className='marketing'
                            sidebar_items={[
                                { href: 'affiliate_country_manager',     string: it.L('Affiliate/Country Manager') },
                                { href: 'technical_marketing_executive', string: it.L('Technical Marketing Executive') },
                                { href: 'graphic_designers',             string: it.L('Graphic Designers') },
                                { href: 'copywriter',                    string: it.L('Copywriter') },
                                { href: 'translator',                    string: it.L('Translator') },
                                { href: 'proofreader',                   string: it.L('Proofreader') },
                            ]}
                        />

                        <SideBar
                            className='compliance'
                            sidebar_items={[
                                { href: 'compliance_executive', string: 'Compliance Executive' },
                                { href: 'anti_fraud_officer',   string: 'Anti-Fraud Officer' },
                            ]}
                        />
                    </div>
                </div>

                <div className='gr-9 gr-padding-10 gr-12-m gr-12-p sections'>
                    <div className='information_technology'>
                        <div className='invisible' id='devops_engineer'>
                            <h1>{it.L('DevOps Engineer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development and operation of our high-traffic web applications.', it.website_name)}</p>
                            <p>{it.L('As our DevOps Engineer, you will have a critical role in our approach to our infrastructure and operations. The stability and scalability of our applications have a direct impact on our bottom line. This means that you will be taking on a mission critical role.')}</p>
                            <p>{it.L('To excel, you must demonstrate a passion for open-source technologies. You must also have a burning desire to challenge yourself in a fast-paced environment.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Collaborate with a team of world-class, Linux-based Devops Engineers') },
                                    { text: it.L('Translate the ongoing business needs of the company into a suitable IT infrastructure') },
                                    { text: it.L('Monitor hardware and software deployment, including our worldwide network of servers and office networks') },
                                    { text: it.L('Oversee incident responses for our production servers') },
                                    { text: it.L('Take necessary measures to correct and enhance IT operations') },
                                    { text: it.L('Manage security, intrusion detection, DDoS protection, and PCI compliance measures for each deployed server') },
                                    { text: it.L('Conduct disaster and recovery planning, as well as their execution') },
                                    { text: it.L('Improve our automation (Chef, etc.)') },
                                    { text: it.L('Keep our infrastructure up-to-date with current cutting edge developments') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Expertise in cloud solutions and infrastructure virtualization, including AWS, Google Cloud Platform, and KVM') },
                                    { text: it.L('Experience with Linux and open-source applications such as rsyslog, DHCP, iptables, Postfix, NGINX, and initialization systems such as systemd and SysVinit') },
                                    { text: it.L('Extensive experience with TCP/IP networking, VPNs, and IPsec') },
                                    { text: it.L('Knowledge of hardware and software firewalls, intrusion detection methods, security systems, and DDoS protection') },
                                    { text: it.L('Thorough knowledge of bash scripting, and experience with the Perl scripting language') },
                                    { text: it.L('Experience in Chef, Ansible, SaltStack, or similar configuration management tools') },
                                    { text: it.L('Experience in site reliability engineering (SRE)') },
                                    { text: it.L('Experience in managing round-the-clock operations for incident resolution, including alerts, rotations, and escalations') },
                                    { text: it.L('Experience designing and working with high-availability web service architecture') },
                                    { text: it.L('Experience in application containerization') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='system_administrator'>
                            <h1>{it.L('System Administrator')}</h1>

                            <p>{it.L('The System Administration team is responsible for the upkeep, configuration, and reliable operation of our computer software, hardware, and networks.')}</p>
                            <p>{it.L('To excel, you must demonstrate a passion for open-source technologies. You must also have a burning desire to challenge yourself in a fast-paced environment.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Assist in the daily IT requirements of Malta office') },
                                  { text: it.L('Plan and implement IT solutions to achieve desired results') },
                                  { text: it.L('Keep up with the latest developments in IT and maintain knowledge relevant to the requirements of the business') },
                                  { text: it.L('Plan and implement methods of best practices in IT security') },
                                  { text: it.L('Review and maintain third-party services used by the company') },
                                  { text: it.L('Recommend alternatives to redundant or obsolete systems') },
                                  { text: it.L('Manage and maintain all software, hardware, and associated peripherals including printers, copiers, and phones') },
                                  { text: it.L('Manage IT assets and maintain an up-to-date asset registry') },
                                  { text: it.L('Liaise with external suppliers to ensure purchases are made at the most cost-efficient rate') },
                                  { text: it.L('Prepare and present proposals for the provisioning of IT-related systems and services') },
                                  { text: it.L('Provide onsite support to all employees with the necessary hardware and software required for their jobs') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('A diploma or degree in Computer Science or Information Technology, or good experience in the field of IT operations/administration') },
                                  { text: it.L('Exceptional English communication skills (both oral and written)') },
                                  { text: it.L('Hands-on experience in troubleshooting computer software, hardware, and a variety of internet applications and networks.') },
                                  { text: it.L('Hands-on experience in systems and network security. Experience with Fortigate or similar devices (e.g.Cisco, Mikrotik)') },
                                  { text: it.L('Knowledge of Mac or Linux Technologies and associated security risks') },
                                  { text: it.L('Knowledge of VPN concepts and prior experience of setting up site-to-site networks') },
                                  { text: it.L('Experience with +DRAC is a plus') },
                                  { text: it.L('Experience in ARUBA or similar enterprise WiFi AP management is a plus.') },
                                  { text: it.L('Experience in end-user device security audit and policy implementation is a plus') },
                                  { text: it.L('The willingness to learn new skills') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='backend_developer'>
                            <h1>{it.L('Back-End Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high-traffic networks. As our Senior Back-End Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Develop and maintain world-class web applications.') },
                                  { text: it.L('Build, maintain, and optimise the technology that powers our servers, applications, and Databases.') },
                                  { text: it.L('Work closely with other teams to come up with effective architecture to support the deployment of new products and features.') },
                                  { text: it.L('Troubleshoot and debug problems in existing applications, and find new ways to improve their speed, functionality, and scalability.') },
                                  { text: it.L('Participate in all aspects of the product lifecycle.') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Experience with languages such as Perl, Python, PHP, C/C++, Go, or Ruby, and a willingness to become highly proficient with Perl.') },
                                  { text: it.L('Expertise in Linux system administration.') },
                                  { text: it.L('Experience with relational database design, and/or open-source RDBMS systems such as MySQL and PostgreSQL.') },
                                  { text: it.L('Familiarity with Perl DBI, Moose, PSGI/Plack, NGINX, JavaScript, Redis, and Git.') },
                                  { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques.') },
                                  { text: it.L('Passion for Linux and other open-source platforms.') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='frontend_developer'>
                            <h1>{it.L('Front-End Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our websites, applications, and high-traffic networks. As our Front-End Developer, you will be taking on the challenge of developing and maintaining advanced applications and interfaces that connect clients with our patented trading system.', it.website_name)}</p>
                            <p>{it.L('You will also test and debug complex technical and UI issues related to our trading platform (that processes over one million transactions per day), based on feedback from our clients and customer service team.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Develop and maintain advanced features, tools, and applications according to best practices in UI/UX, front-end development and hybrid mobile application development.') },
                                  { text: it.L('Test and debug our ever-evolving product line to improve their speed, scalability, and usability across multiple browsers, devices, and web standards.') },
                                  { text: it.L('Stay on top of the latest JavaScript frameworks, libraries, and tools in order to apply them when necessary to solve challenges related to web and mobile development.') },
                                  { text: it.L('Ensure the design and development of each page or product is consistent with our style guide, and that everything works as planned with each release.') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Extensive knowledge in advanced coding techniques, cross-platform development, and hybrid mobile app development.') },
                                  { text: it.L('Ability to write high-quality, self-documenting code using test-driven development techniques.') },
                                  { text: it.L('Extensive experience of JavaScript, HTML, CSS, AJAX, and JSON.') },
                                  { text: it.L('Familiarity with various JavaScript standards, libraries, frameworks, compilers, and transpilers including ES6, TypeScript, Babel, SystemJS, Web Workers, jQuery, React, and Angular.') },
                                  { text: it.L('Experience with package managers (npm), task runners (Gulp, Webpack, Grunt), CSS processors (Sass, Stylus), and APIs (WebSocket).') },
                                  { text: it.L('Familiarity with testing and debugging processes, including unit testing and UI testing.') },
                                  { text: it.L('Passion for Linux and other open-source platforms') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='perl_developer'>
                            <h1>{it.L('Perl Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high- traffic networks. As our Perl Developer, you will be taking on the challenge of writing robust, high-quality, and production-ready code. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Develop and maintain world-class web applications.') },
                                  { text: it.L('Build, maintain, and optimise the technology that powers our servers, applications, and databases.') },
                                  { text: it.L('Work closely with other teams to come up with effective architecture to support the deployment of new products and features.') },
                                  { text: it.L('Troubleshoot and debug problems in existing applications, and find new ways to improve their speed, functionality, and scalability.') },
                                  { text: it.L('Participate in all aspects of the product lifecycle.') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Deep Perl expertise.') },
                                  { text: it.L('Expertise in Linux system administration.') },
                                  { text: it.L('Experience with relational database design, and/or open-source RDBMS systems such as MySQL and PostgreSQL.') },
                                  { text: it.L('Familiarity with Perl DBI, Moose, PSGI/Plack, nginx, JavaScript, Redis, and Git.') },
                                  { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques.') },
                                  { text: it.L('Event-driven programming in Perl.') },
                                  { text: it.L('Passion for Linux, and other open-source platforms.') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='cryptocurrency_blockchain_developer'>
                            <h1>{it.L('Cryptocurrency/Blockchain Developer')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our system infrastructure and high-traffic networks. As our Cryptocurrency/Blockchain Developer, you will be taking on the challenge of revamping our existing cashier system and infrastructure for our ICO launch. You will also drive all our future blockchain-based projects. Your work will greatly contribute to the architecture that drives our high-traffic binary options trading website.', it.website_name)}</p>

                            <UlText
                              text={it.L('You will:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Design and develop applications and platforms based on blockchain technology') },
                                  { text: it.L('Work closely with both technical and non-technical teams to develop and integrate blockchain solutions for our business') },
                                  { text: it.L('Provide technical leadership on cryptocurrencies and blockchain technology') },
                                  { text: it.L('Research and evaluate blockchain technologies and solutions to identify use cases and implementation') },
                                  { text: it.L('Write robust, high-quality, and production-ready code for our websites and applications') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Experience with languages such as Perl, Python, PHP, C/C++, Go, or Ruby, and a willingness to become highly proficient with Perl') },
                                  { text: it.L('Experience with Solidity and the development of Dapps') },
                                  { text: it.L('Excellent understanding of Bitcoin or other cryptocurrencies') },
                                  { text: it.L('Understanding of cryptography, including asymmetric, symmetric, hash functions, and encryption/signatures') },
                                  { text: it.L('Familiarity with concepts such as blockchain confirmations, multisig, and HD wallets') },
                                  { text: it.L('Knowledge of coloured coins and Ethereum tokens, including ERC20/23/223') },
                                  { text: it.L('Experience with Bitcoin or Geth RPC APIs is a plus') },
                                  { text: it.L('Knowledge of hashing algorithms, including SHA and scrypt') },
                                  { text: it.L('Ability to produce high-quality, self-documenting code by using test-driven development (TDD) techniques') },
                                  { text: it.L('Passion for Linux and other open-source platforms') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='security_researcher'>
                            <h1>{it.L('Security Researcher')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our high-traffic web applications. As our Security Researcher, we expect you to stay informed about the latest security bulletins and findings, and actively monitor our software development pipeline to find and raise potential security issues.', it.website_name)}</p>

                            <p>{it.L('As a strong proponent of open source, we encourage publication of findings, methods, and tools via GitHub and our technical blog at https://tech.binary.com/ You will also assist our developers in understanding and patching the bugs that you find.')}</p>

                            <p>{it.L('You will also encourage security awareness throughout the organisation via regular communication on security best practices and the latest online threats.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Check our systems against the latest attacks, vulnerabilities, and mitigations') },
                                  { text: it.L('Identify attack vectors') },
                                  { text: it.L('Conduct security reviews of production infrastructure') },
                                  { text: it.L('Build security tools and processes for critical infrastructure monitoring, protection, and mitigation') },
                                  { text: it.L('Perform regular pentesting of our web applications') },
                                  { text: it.L('Monitor our automated security scripts and utilise them to identify threats') },
                                  { text: it.L('Manage our bug bounty programme') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Experience with web application security and testing, security monitoring, and intrusion detection') },
                                  { text: it.L('Experience with fuzzing and finding edge cases in validation') },
                                  { text: it.L('Understanding of encryption fundamentals and the OWASP Top 10') },
                                  { text: it.L('A good understanding of attacks and mitigations such as timing, injection (e.g. form parameter/SQL), side-channel, DoS, buffer overflows and DNS cache poisoning') },
                                  { text: it.L('Able to assess the security impact of bugs and API inconsistencies') },
                                  { text: it.L('Familiarity with industry standard tools such as Burp Suit and Metasploit') },
                                  { text: it.L('Experience in writing custom code and scripts to investigate security threats') },
                                  { text: it.L('A clear understanding of the OSI model, TCP/IP, and other industry-standard network defense concepts') },
                                  { text: it.L('Knowledge of the latest industry trends and best practices in information security') },
                                  { text: it.L('Extensive experience in bug bounty programmes such as HackerOne, Bugcrowd, and Cobalt') },
                                  { text: it.L('OSCP, CEH, Security+, CISSP, or any GIAC certification is an advantage') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='ui_ux_designer'>
                            <h1>{it.L('UI/UX Designer')}</h1>

                            <p>{it.L('[_1]\'s UI/UX team explores the many ways that we can design better product experiences for our users. As our UI/UX Designer, you’ll play a key role in conceptualising and defining user experience and interaction across multiple websites and applications.', it.website_name)}</p>

                            <p>{it.L('You will solve complex user experience problems, and seamlessly communicate product features and functions to our users through meaningful design. You will play a key role in creating intuitive and functional products that give our users the best experience possible so we can keep growing our user base and revenue.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Conduct research using a variety of qualitative and quantitative methods') },
                                  { text: it.L('Create user personas; define user task flows and UI specifications; and run A/B tests to understand user behaviours and their most pressing needs.') },
                                  { text: it.L('Be involved in every phase of product development, from concept to execution to launch to give the product a distinct and consistent visual identity, as well as ensure that it fully serves the needs of the end user.') },
                                  { text: it.L('Create and update style guides to establish and maintain a consistent visual identity across our product ecosystem.') },
                                  { text: it.L('Create visual elements for websites and applications, including icons and images.') },
                                  { text: it.L('Create and maintain wireframes and mockups for new and existing products.') },
                                  { text: it.L('Keep up with the latest trends and techniques in design, UI, and UX.') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Proven UI and UX experience with a strong portfolio of work.') },
                                  { text: it.L('Ability to conduct end-to-end UX research, including usability testing, and A/B testing.') },
                                  { text: it.L('Experience in interpreting complex concepts and processes to develop intuitive and logical user flows and usage scenarios.') },
                                  { text: it.L('Extensive experience in creating interactive UI elements for web and mobile apps.') },
                                  { text: it.L('Proficiency in designing intuitive and cohesive screens, pages, and visual elements that work as intended.') },
                                  { text: it.L('Proficiency in Photoshop, Illustrator, Sketch, and other design and wireframing software.') },
                                  { text: it.L('Knowledge of HTML, CSS, and JavaScript for rapid prototyping of websites and apps.') },
                                  { text: it.L('Bachelor’s degree in graphic design, interaction design, visual communication, multimedia, or equivalent.') },
                              ]}
                            />
                        </div>

                    </div>

                    <div className='quality_assurance'>
                        <div className='invisible' id='software_tester'>
                            <h1>{it.L('Software Tester')}</h1>

                            <p>{it.L('[_1]\'s IT team is responsible for the design, development, and operation of our websites, applications, and high-traffic networks. As our Software Tester, we rely on you to run high-quality tests to ensure the stability, quality, and usability of our website and codebase with each software release.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Test the Binary.com website, applications, backend, and back-office systems.') },
                                    { text: it.L('Work closely with the rest of the QA and IT teams to plan, design, and execute several types of testing based on different objectives.') },
                                    { text: it.L('Create, execute, and update manual and automated test plans.') },
                                    { text: it.L('Plan and integrate various types of testing into our existing workflow.') },
                                    { text: it.L('Ensure the integrity of releases by coordinating testing activities.') },
                                    { text: it.L('Track and document thoroughly the bugs that you find.') },
                                    { text: it.L('Investigate, reproduce, identify, document, and resolve issues reported by our clients and the customer support team.') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Bachelor’s degree in computer science, or an equivalent combination of technical education, training, and work experience.') },
                                    { text: it.L('Ability to write high-quality, self-documenting code using test-driven development techniques.') },
                                    { text: it.L('Minimum two years experience in a software or web application testing role.') },
                                    { text: it.L('Experience designing and executing test plans (both automated and manual).') },
                                    { text: it.L('Extensive knowledge of JavaScript , AJAX, JSON, CSS.') },
                                    { text: it.L('Proficiency with one or more scripting languages, such as Python, PHP or C/C++. Perl is preferred.') },
                                    { text: it.L('Experience with agile development methods such as Scrum or Kanban.') },
                                    { text: it.L('Experience with Postgres or another RDBMS is a plus.') },
                                    { text: it.L('Familiarity with Git.') },
                                    { text: it.L('Passion for Linux and other open-source platforms.') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='quantitative_analysis'>
                        <div className='invisible' id='quantitative_analyst'>
                            <h1>{it.L('Quantitative Analyst')}</h1>

                            <p>{it.L('[_1]\'s Quantitative Analytics team is responsible for the pricing of our binary options. You will join them in managing the risk and profitability of the company’s options book.', it.website_name)}</p>

                            <p>{it.L('The work that you do is complex, challenging, and essential to our future.')}</p>

                            <p>{it.L('We process over a million transactions each day, and manage a book of exotic options which exceeds the complexity of the typical derivatives desk.')}</p>

                            <p>{it.L('Since all transactions on the [_1] website are fully automated, our pricing and risk management algorithms must fully consider critical factors such as real-time pricing parameters, data feed irregularities, and latencies.', it.website_name)}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Develop derivatives pricing, risk management models, and algorithms using C/C++, R, MATLAB, Perl, Python, and Java.') },
                                    { text: it.L('Review, develop, and enhance Perl, C++, and R codes used in options pricing, volatility forecasts, and risk management programs.') },
                                    { text: it.L('Maintain accurate system pricing parameters.') },
                                    { text: it.L('Perform data mining using SQL databases, R/S-Plus, OLAP, and other analytical tools.') },
                                    { text: it.L('Monitor website trading activity and minimise abuse.') },
                                    { text: it.L('Generate periodic and special reports that summarise client trading trends.') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('An advanced university degree in Physics, Financial Engineering or Mathematics.') },
                                    { text: it.L('Experience in exotic options pricing, volatility forecasts, high-frequency trading, and the analysis of market inefficiencies.') },
                                    { text: it.L('Knowledge of probability theory, stochastic calculus, numerical methods, Monte-Carlo simulation, differential equations, econometrics, and statistical modelling.') },
                                    { text: it.L('Expertise in the application of object-oriented programming languages (C++, Perl, and Java), coupled with the ability to produce high-quality code.') },
                                    { text: it.L('Experience in using financial information sources such as Bloomberg and Reuters.') },
                                    { text: it.L('Relevant experience in the use of quant programming libraries and frameworks (QuantLib, Pricing Partners, FINCAD, and Numerix), and quant pricing platforms (SuperDerivatives and FENICS) would be a plus.') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='financial_market_analyst'>
                            <h1>{it.L('Financial Market Analyst')}</h1>

                            <p>{it.L('As our Senior Financial Market Analyst, you will manage the day-to-day risk of our trading books, conduct complex quantitative analysis, carry out performance testing, develop advanced data analytics tools, and support other related operations that have a direct impact on the profitability and future growth of our company.')}</p>
                            <p>{it.L('This includes decisions on new markets to launch in, and the spreads and margins we might offer. You must also be able to analyse and interpret large volumes of data, and communicate your research and findings in a clear and concise manner –– either in written reports or presentations.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Create mathematical/statistical models for pricing, analyse fat tails to assess margin requirements, and manage the risk for exotic options, Forex, and CFDs') },
                                  { text: it.L('Create data analytics tools for trading/quantitative analysis') },
                                  { text: it.L('Conduct performance testing including backtesting, stress testing analysis, and benchmarking') },
                                  { text: it.L('Develop risk management models and algorithms using MATLAB/Python/R/C++') },
                                  { text: it.L('Manage day-to-day risk of our trading books') },
                                  { text: it.L('Set up liquidity connections via bridges and gateways for MT4 and MT5 brokers') },
                                  { text: it.L('Conduct research on competitors and industry trends to identify new products and potential markets') },
                                  { text: it.L('Develop mathematical/statistical models for pricing and risk management for all products.') },
                                  { text: it.L('Use advanced data analytics skills to study trends/pattern in financial markets.') },
                                  { text: it.L('Help in developing advanced risk management tools for various markets (forex, equities, commodities)') },
                                  { text: it.L('Prepare daily, weekly, and monthly financial reports') },
                                  { text: it.L('Generate periodic and special reports on client trading activity and significant trends that impact our client behaviour') },
                              ]}
                            />

                            <UlText
                              text={it.L('Requirements:')}
                              className='bullet'
                              items={[
                                  { text: it.L('An advanced university degree in physics, financial engineering, or mathematics is preferred') },
                                  { text: it.L('Experience in Forex spot trading or exotic options pricing, volatility forecasts, high-frequency trading, and the analysis of market inefficiencies') },
                                  { text: it.L('Firm grasp of advanced risk management concepts, including hedging, Greeks (first and second generation), Value at Risk models, etc.') },
                                  { text: it.L('Experience in using financial information sources such as Bloomberg and Reuters') },
                                  { text: it.L('Strong analytical skills and the ability to communicate your findings in a clear, concise, and effective manner') },
                                  { text: it.L('Relevant experience in the use of quant programming libraries and frameworks (QuantLib, Pricing Partners, FINCAD, and Numerix), and quant pricing platforms (SuperDerivatives and FENICS) would be a plus.') },
                              ]}
                            />
                        </div>
                    </div>

                    <div className='marketing'>
                        <div className='invisible' id='affiliate_country_manager'>
                            <h1>{it.L('Affiliate/Country Manager')}</h1>

                            <p>{it.L('The Country Manager is expected to acquire, service, manage, and expand our network of active affiliates in Russian-speaking countries. You will also contribute your energy, skills, and knowledge of the local business culture to increase our rapid growth rate worldwide.')}</p>
                            <p>{it.L('You are also expected to help us promote our cutting-edge trading platform that has been one of the most recognised in the binary options trading industry for over 18 years.')}</p>

                            <UlText
                                text={it.L('Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Recruit, train, and nurture affiliates and IBs in Russian-speaking countries, leveraging your direct knowledge and experience of the local market') },
                                    { text: it.L('Drive rapid growth and business development to support the company&#39;s sales and marketing objectives') },
                                    { text: it.L('Coordinate business development activities and generate high-quality partnership leads') },
                                    { text: it.L('Adapt affiliate marketing tactics and promotional materials as needed to localise all content for maximum effectiveness') },
                                    { text: it.L('Utilise a variety of tactics – both online and offline – to grow and support the company’s network of partners in your designated market') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Bachelor’s degree in marketing, business administration, or related discipline') },
                                    { text: it.L('At least 5 years of experience in affiliate marketing, growth hacking, business development, and other closely-related skills') },
                                    { text: it.L('An assertive, sales-driven personality, able to adapt quickly and achieve powerful results') },
                                    { text: it.L('Strong oral and written communication skills in both the regional language(s) and English') },
                                    { text: it.L('Knowledge and experience in the financial services industry and/or binary options trading') },
                                    { text: it.L('IT knowledge or experience is preferred') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='technical_marketing_executive'>
                            <h1>{it.L('Technical Marketing Executive')}</h1>

                            <p>{it.L('The Marketing team oversees all our marketing initiatives, such as our partnership programmes, social media presence, webinars, PPC, SEO, and email marketing. As our Technical Marketing Executive, you will act on data-driven information and assist in troubleshooting issues to further nurture and grow our client base.')}</p>

                            <UlText
                              text={it.L('Responsibilities:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Act as first and second level support for our traders by offering them solutions through basic coding and troubleshooting techniques') },
                                  { text: it.L('Engage in market development to grow the client base for existing products and platforms of the company') },
                                  { text: it.L('Perform market research and analysis to uncover trends, prospects, partners, and competitors for our client base') },
                                  { text: it.L('Support overall development, planning and execution of the team’s digital marketing efforts in accordance to the marketing objectives of respective projects') },
                                  { text: it.L('Contribute creative ideas to further the company’s dynamic branding effort') },
                              ]}
                            />

                            <UlText
                              text={it.L('Preferences:')}
                              className='bullet'
                              items={[
                                  { text: it.L('Exceptional English communication skills (both oral and written)') },
                                  { text: it.L('Creative and analytical thinking that leads to actionable tactics and measurable results') },
                                  { text: it.L('An intermediate understanding of the interaction of information technology and client servicing aspects within the B2B and B2C environments') },
                                  { text: it.L('University degree in Marketing, Mathematics, IT/Programming or any related field') },
                                  { text: it.L('Considerable knowledge in creating meaningful analytics from raw data, with the goal of influencing clients to take action') },
                                  { text: it.L('A broad foundation in HTML, CSS, Websocket API or MQL programming to develop solutions and answer queries') },
                                  { text: it.L('A keen eye to identify new trends in marketing, evaluate new technologies and ensure the brand is at the forefront of industry developments') },
                              ]}
                            />
                        </div>

                        <div className='invisible' id='graphic_designers'>
                            <h1>{it.L('Graphic Designers')}</h1>

                            <p>{it.L('[_1] is looking to recruit highly skilled, experienced designers who are passionate about developing attractive visuals for both online and offline applications.', it.website_name)}</p>
                            <p>{it.L('Create the graphics required to support our global marketing and advertising campaigns. The team\'s creative efforts span a number of channels, including online marketing, affiliate networks, print advertising, tradeshows, special events, and promotional projects.')}</p>
                            <p>{it.L('Join our team of bright, talented professionals. Work collaboratively with us to enhance and promote a high-tech platform that has been one of the most recognised in the binary options trading industry for over 15 years.')}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Work directly with members of our marketing and IT teams to produce graphics for the company website, blog, social media outlets, and marketing materials') },
                                    { text: it.L('Create content to support our international marketing campaigns in a variety of different formats and languages') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Strong, passionate interest in Graphic Design, Marketing, and Advertising') },
                                    { text: it.L('Ability to communicate fluently in the English language, in both oral and written forms') },
                                    { text: it.L('University degree, preferably in Graphic Design or a related discipline') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('UX / UI experience') },
                                    { text: it.L('Web design / development experience') },
                                    { text: it.L('Prior knowledge and experience with the financial industry') },
                                    { text: it.L('Ability to speak multiple languages') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='copywriter'>
                            <h1>{it.L('Copywriter')}</h1>

                            <p>{it.L('[_1] seeks a sharp Copywriter to produce content that actively engages new prospects and current customers based throughout the world.', it.website_name)}</p>
                            <p>{it.L('Join our team of bright, talented professionals. Work collaboratively with us to enhance and promote a high-tech platform that has been one of the most recognised in the binary options trading industry for over 15 years.')}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Create clear, concise and engaging content for display on the company\'s website, blog, social media outlets, and marketing materials') },
                                    { text: it.L('Develop text that promotes the company\'s product offerings in a variety of formats') },
                                    { text: it.L('Educate prospects, clients, and partners regarding the benefits of [_1]\'s innovative online trading platform', it.website_name) },
                                    { text: it.L('Adapt tone of voice as appropriate to suit specified target audiences') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('The ability to translate information into clear, concise, and engaging content') },
                                    { text: it.L('Effective English language skills, with precise attention to detail regarding punctuation, spelling, grammar, and syntax') },
                                    { text: it.L('The ability to multi-task, balance deadlines, and reliably deliver high-quality content') },
                                    { text: it.L('University degree in Marketing, Communications, Journalism, or related discipline') },
                                ]}
                            />

                            <UlText
                                text={it.L('Preferences:')}
                                className='bullet'
                                items={[
                                    { text: it.L('The ability to speak and write in multiple languages') },
                                    { text: it.L('Knowledge and experience in the financial services industry') },
                                    { text: it.L('A background in IT development') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='translator'>
                            <h1>{it.L('Translator')}</h1>

                            <p>{it.L('[_1] is seeking qualified translation professionals familiar with specific target markets, languages, and cultures. By delivering high-quality translation to support our customers in a particular language, you will serve as the company\'s voice to clients in certain key areas of the world. You\'ll work with colleagues in IT, Customer Support, and Marketing to provide localised text and translation services through a web-based tool. This position will report to our Translation Project Manager.', it.website_name)}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Process website content translations regularly and efficiently, delivering high-quality work on a dependable basis') },
                                    { text: it.L('Assist in the proofreading and recording of video presentations') },
                                    { text: it.L('Ensure compliance with quality control standards governing website content') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A native speaker with strong command of the English language, in both oral and written form') },
                                    { text: it.L('Ability to work with a simple web-based translation tool') },
                                    { text: it.L('Previous experience with financial / binary options website services') },
                                    { text: it.L('A university degree or accredited translation certification preferred') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='proofreader'>
                            <h1>{it.L('Proofreader')}</h1>

                            <p>{it.L('[_1] is seeking a qualified proofreader with a flair for language and a meticulous eye for detail. You must be able to interact with our staff using a web-based translator interface. You\'ll work with colleagues in IT, Customer Support and Marketing to provide localised text and translation services.', it.website_name)}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                paragraph= {it.L('Under the supervision of [_1]\'s Translation Project Manager, you will:', it.website_name)}
                                items={[
                                    { text: it.L('Proofread and correct the content appearing on the company\'s website, blog, social media outlets, and marketing materials, from English to the regional language and vice versa') },
                                    { text: it.L('Use appropriate terminology, taking into account the style and nuance of the original text') },
                                    { text: it.L('Maintain adequate speed and volume of output') },
                                    { text: it.L('Process website content translations when a full time translator is unavailable') },
                                    { text: it.L('Ensure compliance with the quality standards that govern our website content') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Strong command of the English language, in both oral and written form') },
                                    { text: it.L('Previous experience with financial and/or binary options trading websites') },
                                    { text: it.L('A university degree or accredited translation certification preferred') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='accounting'>
                        <div className='invisible' id='accounts_and_payments_executive'>
                            <h1>{it.L('Accounts And Payments Executive')}</h1>

                            <UlText text={it.L('Duties and Responsibilities:')} />
                            <p>{it.L('As an Accounts And Payments Executive, you will be responsible for the processing of client payments, handling and resolving client payment queries, assisting with the management accounts of the companies within our group, performing reconciliations, preparing reports, and constantly liaising with all other departments within the company in relation to client payments and accounts. You will work within a multi-national team, using the proprietary accounting and backoffice systems provided by the company.')}</p>

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Life-long career interest in the Accounting field') },
                                    { text: it.L('A degree major in Accounting or other relevant professional qualifications') },
                                    { text: it.L('At least 1 year working experience is required for this position') },
                                    { text: it.L('Excellent English language (written and oral) communication skills') },
                                    { text: it.L('Excellent IT/office skills') },
                                    { text: it.L('Ability to work in a multicultural and international environment') },
                                    { text: it.L('Motivated, accurate, organized and a self-starter') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='compliance'>
                        <div className='invisible' id='compliance_executive'>
                            <h1>{it.L('Compliance Executive')}</h1>

                            <p>{it.L('In order to support its continued growth, [_1] is seeking to recruit and place a qualified Compliance Executive. In this newly created role, to be based in Malta, the incumbent will report to our Head of Regulatory and Legal Compliance', it.website_name)}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Ensuring that the Binary Group of companies are in full compliance with the regulatory regimes to which they are subject') },
                                    { text: it.L('Working closely with the Head of Compliance to implement Know your Client (KYC), Anti-Money Laundering (AML), and data protection regulations') },
                                    { text: it.L('Preparing the periodic and special reports required to ensure legal and regulatory compliance in the jurisdictions within which we operate') },
                                    { text: it.L('Assisting the Head of Compliance in applying for the licenses required for group companies in new jurisdictions') },
                                    { text: it.L('Assisting with the regulatory and statutory audit of Binary Group companies worldwide') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A tertiary level education') },
                                    { text: it.L('A full understanding of, and a keen interest in, corporate legal compliance') },
                                    { text: it.L('Experience working within an international environment') },
                                    { text: it.L('The ability to acquire knowledge of compliance matters in a multitude of international jurisdictions') },
                                    { text: it.L('A proactive approach to solving problems and delivering client solutions') },
                                    { text: it.L('Work experience in a similar role') },
                                ]}
                            />
                        </div>

                        <div className='invisible' id='anti_fraud_officer'>
                            <h1>{it.L('Anti-Fraud Officer')}</h1>

                            <p>{it.L('[_1]\'s principal Anti-Fraud Officer is responsible for the exercise of exceptional client relationship management skills applied to the prevention of fraudulent activities in payments processing and business transactions. He or she will be expected to partner with our payments and compliance teams in resolving payment queries; administering chargebacks; conducting anti-money laundering audits, and implement a broad array of fraud prevention measures.', it.website_name)}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Effectively monitor daily client activity') },
                                    { text: it.L('Audit deposit patterns and take action on fraud or abuse') },
                                    { text: it.L('Review suspicious account transactions') },
                                    { text: it.L('Follow up on rejected deposits') },
                                    { text: it.L('Run daily payments reports and report suspected fraud') },
                                    { text: it.L('Liaise with banks and payment providers') },
                                    { text: it.L('Set client deposit and loss limits') },
                                    { text: it.L('Analyze data regarding fraud, risk assessment, and anti-money laundering') },
                                    { text: it.L('Document account chargebacks') },
                                    { text: it.L('Manage the company\'s cashier system') },
                                    { text: it.L('Update the Anti-Fraud Manual and other related documents') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Excellent English language skills (both oral and written)') },
                                    { text: it.L('Experience in an anti-fraud or risk management role') },
                                    { text: it.L('Effective analytical and administrative skills') },
                                    { text: it.L('A detail orientation with the ability to detect patterns') },
                                    { text: it.L('A university degree in a related field is a plus') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='customer_support'>
                        <div className='invisible' id='global_customer_service_representatives'>
                            <h1>{it.L('Global Customer Service Representatives')}</h1>
                            <p>{it.L('[_1] has several exceptional career opportunities for Customer Service Professionals.', it.website_name)}</p>
                            <p>{it.L('As a member of our global Client Service Team you will serve as the voice of our customers by resolving and reducing client service issues.')}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Resolve complex customer care issues in the best interest of our global clients and the company') },
                                    { text: it.L('Respond to client queries using our state of the art telephone and electronic mail') },
                                    { text: it.L('Work to expand our international client base by applying creative marketing and customer support strategies') },
                                    { text: it.L('Collaborate with members of our IT Group to identify innovative ways to improve our website\'s capability and performance') },
                                ]}
                            />

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('Excellent English language skills, both oral and written') },
                                    { text: it.L('Proficiency in a second language (oral and written) is preferred') },
                                    { text: it.L('Previous work experience in a client service and/or marketing role') },
                                    { text: it.L('Experience in the financial services industry is preferred') },
                                    { text: it.L('A university degree in marketing or computer science is a plus') },
                                ]}
                            />
                        </div>
                    </div>

                    <div className='human_resources'>
                        <div className='invisible' id='human_resource_executive'>
                            <h1>{it.L('Human Resource Executive')}</h1>

                            <p>{it.L('In order to support its continued growth, the Human Resources Group at [_1] is seeking to place a highly competent administrator in a senior recruitment role. Please note that this is not a position suitable for an HR generalist, but should be of keen interest to a high level administrator with extensive experience in the global recruitment of managers and single technical contributors. A background in financial services and experience in the recruitment of senior professionals in IT and Quantitative Analytics would be ideal.', it.website_name)}</p>

                            <UlText
                                text={it.L('Duties and Responsibilities:')}
                                className='bullet'
                                items={[
                                    { text: it.L('In this newly created role, to be based on our offices in Cyberjaya, Malaysia, you will be responsible for:') },
                                    { text: it.L('Supporting the Group\'s global recruiting and talent management needs') },
                                    { text: it.L('Advising senior managers regarding salary negotiations and job offers') },
                                    { text: it.L('Administering the company\'s semi-annual performance appraisal process') },
                                    { text: it.L('A broad array of HR-related administrative tasks') },
                                ]}
                            />

                            <p>{it.L('Qualified applicants should have global experience in recruitment administration, excellent administrative skills, and the ability to work in a fast-paced entrepreneurial environment. We are seeking a true professional capable of making an impact by supporting and advancing HR best practices throughout the company\'s global operations.')}</p>
                        </div>
                    </div>

                    <div className='administrator'>
                        <div className='invisible' id='administrative_executive'>
                            <h1>{it.L('Administrative Executive')}</h1>

                            <p>{it.L('[_1] is seeking a junior to mid-career professional with exceptional administrative and organization skills to join its General Affairs Team.', it.website_name)}</p>

                            <UlText text={it.L('Duties and Responsibilities:')} />
                            <p>{it.L('As a General Affairs Executive, you will provide administrative support to several departments in areas related to vendor management, event planning, accounting, and human resources administration to name a few.')}</p>

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('An Advanced/Higher/Graduate Diploma or a Bachelor\'s Degree') },
                                    { text: it.L('Relevant work experience in a related field (financial services preferred)') },
                                    { text: it.L('Effective PC skills with extensive experience in MS Office applications') },
                                    { text: it.L('Well-developed organizational, administrative, and/or accounting skills') },
                                    { text: it.L('Excellent written and verbal communication skills in both English and Bahasa Malaysia') },
                                ]}
                            />

                            <p>{it.L('Fresh graduates who meet our basic requirements and are passionate about pursuing a professional career in administrative services are welcome to apply.')}</p>
                        </div>
                    </div>

                    <div className='internal_audit'>
                        <div className='invisible' id='internal_auditor'>
                            <h1>{it.L('Internal Auditor')}</h1>

                            <p>{it.L('We are looking for energetic and enthusiastic individuals who love challenges, are detail-oriented and highly analytical to join our Internal Audit team.')}</p>

                            <UlText text={it.L('Duties and Responsibilities:')} />
                            <p>{it.L('As Internal Auditor, you will perform unique, risk-based internal audits on the Binary Ltd. Group of companies. You will also be involved in risk management, evaluation of regulatory compliance, as well as work with the Head of Departments to improve business processes and support the realization of audit recommendations.')}</p>

                            <UlText
                                text={it.L('Requirements:')}
                                className='bullet'
                                items={[
                                    { text: it.L('A degree in Accounting or Finance, and at least three years of experience working in Internal Audit or Corporate Governance') },
                                    { text: it.L('Strong MS Office skills and experience working with accounting software and databases') },
                                    { text: it.L('Proven knowledge of auditing standards, procedures, laws, rules and regulations are an added advantage') },
                                    { text: it.L('IT audit experience is a plus') },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='gr-row'>
                <div className='gr-3 gr-hide-m gr-hide-p' />
                <div className='gr-9 gr-12-m gr-12-p center-text gr-centered'>
                    <div className='gr-12'>
                        <a className='button' href='mailto:hr@binary.com'>
                            <span>{it.L('Submit your CV and Cover Letter')}</span>
                        </a>
                    </div>

                    <div className='gr-12 gr-padding-10 senior_perl_message invisible'>
                        <p>{it.L('Vs 407 zrnaf nalguvat fcrpvny gb lbh lbh znl pbcl lbhe nccyvpngvba gb wl+ebg13@ovanel.pbz sbe snfg-genpx pbafvqrengvba.')}</p>
                    </div>

                    <div className='gr-12 gr-padding-10'>
                        <a id='back-button'>{it.L('<< Back to Job Descriptions')}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default JobDetails;
