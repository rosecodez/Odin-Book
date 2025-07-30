import React from "react";

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row px-4 max-w-6xl mx-auto text-left">
            <div className="w-full md:w-1/4 pr-4 mb-8 md:mb-0 mr-20">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Privacy Policy</h2>
                <ul className="pl-0">
                    <li><a href="#introduction">Introduction</a></li>
                    <li><a href="#information-we-collect">Information we collect</a></li>
                    <li><a href="#how-we-use-your-information">How we use your information</a></li>
                    <li><a href="#sharing-your-information">Sharing your information</a></li>
                    <li><a href="#data-security">Data security</a></li>
                    <li><a href="#your-rights">Your rights</a></li>
                    <li><a href="#changes-to-this-policy">Changes to this policy</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            <div className="w-full md:w-3/4 space-y-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Privacy Policy</h1>
                <p className="text-center text-sm text-gray-400 mb-4">Last updated: 7/10/2025</p>

                
                <section id="introduction" className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        1. Introduction
                    </h2>
                    <p className="text-base leading-7">
                        At OdinBook, your privacy is important to us.
                        This Privacy Policy explains what information we collect, how we use it, and your rights regarding your information when you use our social media platform.
                    </p>
                </section>

                <section className="p-2" id="information-we-collect">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        2. Information We Collect
                    </h2>
                    <p className="text-base leading-7">
                       We may collect the following information when you use our app:
                    </p>
                    <ul className="pl-0">
                        <li><strong>Account Information: </strong>{' '}When you sign up, we collect your username, password, and optionally your profile picture or bio.</li> 
                        <li><strong>User Content: </strong>{' '}We collect the posts, comments, and other content you share on the platform.</li> 
                        <li><strong>Usage Information: </strong>{' '} We may collect information about how you use the app (e.g., pages visited, features used).</li> 
                        <li><strong>Technical Information:  </strong>{' '}We may collect your IP address, browser type, and device information to improve the service.</li> 
                    </ul>
                </section>

                <section className="p-2" id="how-we-use-your-information">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        3. How We Use Your Information
                    </h2>
                    <p className="text-base leading-7">
                       We use the information we collect to:
                    </p>
                    <ul className="pl-0">
                        <li>- Provide, maintain, and improve our app.</li>
                        <li>- Personalize your experience.</li>
                        <li>- Communicate with you, including updates or support.</li>
                        <li>- Ensure security and prevent abuse.</li>
                    </ul>

                </section>

                <section className="p-2" id="sharing-your-information" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        4. Sharing Your Information
                    </h2>
                    <p className="text-base leading-7">
                       We do <strong>not</strong> sell your personal information. We may share information only in the following circumstances:
                    </p>
                    <ul className="pl-0">
                        <li>With service providers who help us operate the platform.</li>
                        <li>When required by law or to protect the rights and safety of our users or others.</li>
                    </ul>
                </section>
                <section className="p-2" id="data-security" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        5. Data Security
                    </h2>
                    <p className="text-base leading-7">
                       We take reasonable steps to protect your information but cannot guarantee absolute security.
                    </p>
                </section>
                <section className="p-2" id="your-rights" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        6. Your Rights
                    </h2>
                    <p className="text-base leading-7">
                       You can access, edit, or delete your account at any time. If you have any concerns about your data, please{' '} <a href="https://rosecodez.github.io/Portfolio-Website/" className="text-blue-500 hover:underline inline">contact us
                        </a>.
                    </p>
                </section>
                <section className="p-2" id="changes-to-your-privacy" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        7. Changes to this Policy
                    </h2>
                    <p className="text-base leading-7">
                       We may update this Privacy Policy from time to time. If we make changes, we will notify you by updating the date at the top and may provide additional notice as appropriate.
                    </p>
                </section>
                <section className="p-2" id="contact" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                       8. Contact
                    </h2>
                    <p className="text-base leading-7">
                       If you have questions or concerns about this Privacy Policy, please{' '} <a href="https://rosecodez.github.io/Portfolio-Website/" className="text-blue-500 hover:underline inline">contact us
                        </a>.
                    </p>
                </section>
            </div>
        </div>
    )
}
export default PrivacyPolicy;