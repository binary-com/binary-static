import React from 'react';
import SeparatorLine from '../../_common/components/separator_line.jsx';

const Column = ({
    className,
    header,
    text,
    id,
    subsection,
}) => (
    <div className='eq'>
        {className ?
            <h3 className={className}>{header}</h3>
            :
            <h3>{header}</h3>
        }
        <p>{text}</p>
        <a href={it.url_for(`open-positions/job-details?dept=${id}#${subsection}`)}>{it.L('Learn more')}</a>
    </div>
);

const Row = ({ title, id, sections = [], last }) => (
    <React.Fragment>
        <div className='gr-row gr-padding-10' id={id}>
            <div className='gr-3 gr-12-m'>
                <div className='gr-12 gr-padding-10 center-text'>
                    <h2 className='gr-gutter'>{title}</h2>
                    <img className='responsive' src={it.url_for(`images/pages/careers/${id}.svg`)} />
                </div>
            </div>
            <div className='gr-9 gr-12-m'>
                <div className='eqWrap'>
                    {sections.map((section, idx) => (
                        <Column
                            header={section.header}
                            text={section.text}
                            subsection={section.subsection}
                            className={section.className}
                            id={id}
                            key={idx}
                        />
                    ))}
                </div>
            </div>
        </div>
        {!last ? <SeparatorLine /> : '' }
    </React.Fragment>
);

const JobDescriptions = () => (
    <div className='open-positions container'>
        <div className='gr-parent static_full'>
            <div className='gr-padding-10'>
                <h1>{it.L('Open Positions')}</h1>
            </div>

            <Row
                id='information_technology'
                title={it.L('Information Technology')}
                sections={[
                    { header: it.L('DevOps Manager / Team Lead'), subsection: 'devops_manager',            text: it.L('Responsibilities include hardware and software deployment, network security, intrusion detection, and load balancing.') },
                    { header: it.L('Senior Front-End Developer'), subsection: 'senior_frontend_developer', text: it.L('Tasked with writing robust, high-quality, production-ready code as well as refactoring and optimizing a large and complex legacy code base.') },
                    { header: it.L('Senior Perl Developer'),      subsection: 'senior_perl_developer',     text: it.L('Tasked with writing robust, high-quality, production-ready code and contributing to the architecture that drives our high-traffic global website.'), className: 'one-line nowrap' },
                ]}
            />

            <Row
                id='quality_assurance'
                title={it.L('Quality Assurance')}
                sections={[
                    { header: it.L('Quality Assurance Engineer'), subsection: 'quality_assurance_engineer', text: it.L('Execute and update manual and automated test plans, ensure the integrity of releases, investigate and reproduce client-reported issues.'), className: 'nowrap' },
                ]}
            />

            <Row
                id='quantitative_analysis'
                title={it.L('Quantitative Analysis')}
                sections={[
                    { header: it.L('Quantitative Developer'), subsection: 'quantitative_developer', text: it.L('Responsible for the risk management and derivatives pricing of the company, including implementation and maintenance.') },
                    { header: it.L('Quantitative Analyst'),   subsection: 'quantitative_analyst',   text: it.L('Responsible for the pricing of binary options offered on the [_1] website and the risk management and profitability of its options book.', it.website_name) },
                ]}
            />

            <Row
                id='marketing'
                title={it.L('Marketing')}
                sections={[
                    { header: it.L('Marketing Project Coordinator'), subsection: 'marketing_project_coordinator', text: it.L('Work with senior staff to coordinate project delivery; develop and update schedules; document processes; and push initiatives to successful completion.') },
                    { header: it.L('Social Media Executive'),        subsection: 'social_media_executive',        text: it.L('Enhance and proactively manage the company\'s social-media efforts, using a variety of channels to attract and nurture prospects, clients, partners, and recruits.') },
                    { header: it.L('Affiliate Manager'),             subsection: 'affiliate_manager',             text: it.L('Drive rapid growth from key areas of the world, applying a variety of online and offline marketing abilities to expand the company\'s active affiliate network.') },
                    { header: it.L('Graphic Designers'),             subsection: 'graphic_designers',             text: it.L('Design engaging, visually inspiring content for the company\'s website and many other forms of media, including both online and offline materials.') },
                    { header: it.L('Marketing Executives'),          subsection: 'marketing_executives',          text: it.L('Contribute your creativity and marketing capabilities to further the company\'s branding efforts, implementing a broad array of promotional campaigns.') },
                    { header: it.L('Copywriter'),                    subsection: 'copywriter',                    text: it.L('Create clear, concise, and engaging content that effectively promotes the company\'s trading platform and product offerings in a variety of formats.') },
                    { header: it.L('Translator'),                    subsection: 'translator',                    text: it.L('Work with colleagues in IT, Customer Support, and Marketing to provide localised text for our global website, blog, social media outlets, and promotional materials.') },
                    { header: it.L('Proofreader'),                   subsection: 'proofreader',                   text: it.L('Apply a meticulous eye for detail in proofreading the content that appears on the company\'s website, blog, social media outlets, and marketing materials.') },
                ]}
            />

            <Row
                id='accounting'
                title={it.L('Accounting')}
                sections={[
                    { header: it.L('Accounts And Payments Executive'), subsection: 'accounts_and_payments_executive', text: it.L('Responsible for the processing of client payments, assisting with the management accounts of the companies within our group, and more.') },
                ]}
            />

            <Row
                id='compliance'
                title={it.L('Compliance')}
                sections={[
                    { header: it.L('Compliance Executive'), subsection: 'compliance_executive', text: it.L('Ensuring that the Binary Group of companies are in full compliance with the legal and regulatory regimes to which they are subject.') },
                    { header: it.L('Anti-Fraud Officer'),   subsection: 'anti_fraud_officer',   text: it.L('Exercise exceptional client relationship management skills to prevent fraudulent activities in payments processing and business transactions.') },
                ]}
            />

            <Row
                id='customer_support'
                title={it.L('Customer Support')}
                sections={[
                    { header: it.L('Customer Service Representatives'), subsection: 'global_customer_service_representatives', text: it.L('As a member of our global Client Service Team you will serve as the voice of our customers by resolving and reducing client service issues.') },
                ]}
            />

            <Row
                id='human_resources'
                title={it.L('Human Resources')}
                sections={[
                    { header: it.L('Human Resource Executive'), subsection: 'human_resource_executive', text: it.L('Responsible for supporting the Group\'s global recruiting and talent management needs and a broad array of HR-related administrative tasks.') },
                ]}
            />

            <Row
                id='administrator'
                title={it.L('Administrator')}
                sections={[
                    { header: it.L('Administrative Executive'), subsection: 'administrative_executive', text: it.L('Provide administrative support in areas related to vendor management, event planning, accounting, and human resources administration.') },
                ]}
            />

            <Row
                id='internal_audit'
                title={it.L('Internal Audit')}
                last
                sections={[
                    { header: it.L('Internal Auditor'), subsection: 'internal_auditor', text: it.L('Involved in evaluation of regulatory compliance and risk management. Work with the Head of Departments to improve business processes.') },
                ]}
            />
        </div>
    </div>
);

export default JobDescriptions;
