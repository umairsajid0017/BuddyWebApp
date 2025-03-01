import Main from "@/components/ui/main";

export default function PrivacyPolicy() {
    return (
        <Main>
                <h2 className="text-3xl font-bold">
                    Privacy Policy
                </h2>
                <p className="text-gray-700">
                    Last updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                </p>
                
                <div className="space-y-4">
                    <p>
                        This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.
                    </p>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Information We Collect
                    </h3>
                    <p>
                        We may collect the following information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personal identification information (Name, email address, phone number)</li>
                        <li>Demographic information (Address, postal code)</li>
                        <li>Payment information (Credit card details, billing address)</li>
                        <li>Website usage data (Pages visited, time spent on site)</li>
                        <li>Device information (IP address, browser type, device type)</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold mt-6">
                        How We Use Your Information
                    </h3>
                    <p>
                        We use the collected information for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To process and fulfill your orders</li>
                        <li>To improve our website and services</li>
                        <li>To send periodic emails regarding your orders or other products and services</li>
                        <li>To personalize your experience and deliver content most relevant to you</li>
                        <li>To provide customer support and respond to your inquiries</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Data Security
                    </h3>
                    <p>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Secure Socket Layer (SSL) encryption for data transmission</li>
                        <li>Regular security assessments and updates</li>
                        <li>Limited access to personal information by authorized personnel only</li>
                        <li>Secure storage of personal data</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Cookies and Tracking Technologies
                    </h3>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Third-Party Disclosure
                    </h3>
                    <p>
                        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as described below:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Trusted third parties who assist us in operating our website, conducting our business, or servicing you</li>
                        <li>Legal authorities when we believe disclosure is appropriate to comply with the law</li>
                        <li>Service providers who help with payment processing, shipping, and customer support</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Your Rights
                    </h3>
                    <p>
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate personal data</li>
                        <li>Request deletion of your personal data</li>
                        <li>Object to processing of your personal data</li>
                        <li>Request restriction of processing your personal data</li>
                        <li>Request transfer of your personal data</li>
                        <li>Withdraw consent at any time</li>
                    </ul>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Changes to This Privacy Policy
                    </h3>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                    
                    <h3 className="text-xl font-bold mt-6">
                        Contact Us
                    </h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p className="mt-2">
                        Email: privacy@example.com<br />
                        Phone: (123) 456-7890<br />
                        Address: 123 Privacy Street, Secure City, 12345
                    </p>
                </div>
        </Main>
    )
}