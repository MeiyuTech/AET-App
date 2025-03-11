/**
 * Footer Component
 *
 * A responsive website footer that provides:
 * - Bilingual support (English/Chinese) with language switcher
 * - Social media icons
 * - Copyright
 *
 * Used as the main footer for all pages in the application.
 */

export default function Footer() {
  return (
    <footer className="bg-[#2B3A4D] text-white py-12 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information Column */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-amber-400">Contact Information</h3>
          <div className="space-y-3 text-xl">
            <p>19800 MacArthur Blvd Ste 420, Irvine CA 92612</p>
            <p>Office Hours: Mon. – Fri. 9:30am - 5:30pm PST</p>
            <div className="flex items-center gap-2">
              <span>Phone</span>
              <a href={`tel:+1 (949) 954-7996`} className="hover:text-teal-400">
                +1 (949) 954-7996
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Email</span>
              <a href={`mailto:ca2@aet21.com`} className="hover:text-teal-400">
                ca2@aet21.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>WeChat</span>
              <span className="hover:text-teal-400">LA9499547996</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
