export default function Terms() {
    return (
        <div className="flex flex-col md:flex-row px-4 max-w-6xl mx-auto text-left">
            <div className="w-full md:w-1/4 pr-4 mb-8 md:mb-0">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Table of Contents</h2>
                <ul className="pl-0">
                    <li><a href="#acceptance-of-terms">Acceptance of Terms</a></li>
                    <li><a href="#user-accounts">User Accounts</a></li>
                    <li><a href="#user-content">User Content</a></li>
                    <li><a href="#privacy">Privacy</a></li>
                    <li><a href="#prohibited-use">Prohibited Use</a></li>
                    <li><a href="#termination">Termination</a></li>
                    <li><a href="#intellectual-property">Intellectual Property</a></li>
                    <li><a href="#change-of-terms">Changes to Terms</a></li>
                    <li><a href="#disclaimer">Disclaimer</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            <div className="w-full md:w-3/4 space-y-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Terms of Service</h1>
                <p className="text-center text-sm text-gray-400 mb-4">Last updated: 7/9/2025</p>
                <p className="text-base leading-7 text-center mb-8 max-w-2xl mx-auto">
                    Welcome to OdinBook, a space to share, connect, and discover. By using our platform, you agree to the following Terms of Service. Please read them carefully.
                </p>
                
                <section id="acceptance-of-terms" className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        1. Acceptance of Terms
                    </h2>
                    <p className="text-base leading-7">
                        By accessing or using OdinBook, you agree to these Terms of Service and our{' '}
                        <a href="/privacy-policy" className="text-blue-500 hover:underline inline">Privacy Policy</a>.
                        <br />
                        If you do not agree, please do not use our platform.
                    </p>
                </section>

                <section className="p-2" id="user-accounts">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        2. User Accounts
                    </h2>
                    <p className="text-base leading-7">
                       To use certain features, you may need to create an account. 
                       You are responsible for keeping your account information secure. Do not share your password or impersonate others.
                    </p>
                </section>

                <section className="p-2" id="user-content">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        3. User Content
                    </h2>
                    <p className="text-base leading-7">
                       You own the content you post. 
                       However, by posting on OdinBook, you give us a license to use, display, and share your content to operate and improve the platform.
                       <br/>
                       You agree not to post:
                    </p>
                    <ol>
                        <li>
                            - Hate speech, threats, or harassment
                        </li>
                        <li>
                            - Nudity or sexually explicit content
                        </li>
                        <li>
                            - Violence, illegal activity, or copyrighted material without permission
                        </li>
                    </ol>
                    <p>We reserve the right to remove any content or account that violates these rules.</p>
                </section>

                <section className="p-2" id="privacy" >
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        4. Privacy
                    </h2>
                    <p className="text-base leading-7">
                       We respect your privacy. Please review our {' '}
                       <a href="/privacy-policy" className="text-blue-500 hover:underline inline">Privacy Policy </a>
                       to understand how we collect, use, and protect your information.
                    </p>
                </section>

                <section className="p-2" id="prohibited-use">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        5. Prohibited Use
                    </h2>
                    <p className="text-base leading-7">
                        You agree not to:
                    </p>
                    <ol>
                        <li>
                            - Use bots, scrapers, or automated methods to access the site
                        </li>
                        <li>
                           - Disrupt or damage the platform
                        </li>
                        <li>
                            - Misuse other users' content or data
                        </li>
                    </ol>
                    <p>We reserve the right to remove any content or account that violates these rules.</p>
                </section>

                <section className="p-2" id="termination">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        6. Termination
                    </h2>
                    <p className="text-base leading-7">
                       We may suspend or terminate your access if you violate these terms or engage in harmful behavior. You may also delete your account at any time.
                    </p>
                </section>

                <section className="p-2" id="intellectual-property">
                    <h2>
                        7. Intellectual Property
                    </h2>
                    <p className="text-base leading-7">
                       All logos, branding, and original features of OdinBook belong to us. Don’t use our branding or content without permission.
                    </p>
                </section>

                <section className="p-2" id="change-of-terms">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        8. Changes to Terms
                    </h2>
                    <p className="text-base leading-7">
                       We may update these Terms from time to time. We'll notify users of significant changes. Continuing to use the app means you accept the updated terms.
                    </p>
                </section>

                <section className="p-2" id="disclaimer">
                    <h2 className="text-xl md:text-2xl font-semibold border-b pb-2">
                        9. Disclaimer
                    </h2>
                    <p className="text-base leading-7">
                      We provide OdinBook "as is." We do not guarantee it will always be secure, error-free, or available.
                    </p>
                </section>

                <section className="p-2" id="contact">
                    <h2>
                        10. Contact
                    </h2>
                    <p className="text-base leading-7">
                       If you have any questions, {' '}
                       <a href="https://rosecodez.github.io/Portfolio-Website/" className="text-blue-500 hover:underline inline">contact us
                       </a>
                    </p>
                </section>
            </div>
        </div>
    )
}