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
            <p>San Francisco Office</p>
            <p>Miami Office</p>
            <p>Office Hours</p>
            <div className="flex items-center gap-2">
              <span>Phone</span>
              <a href={`tel:+1 (415) 935-1122`} className="hover:text-teal-400">
                +1 (415) 935-1122
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Email</span>
              <a href={`mailto:example@example.com`} className="hover:text-teal-400">
                example@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
