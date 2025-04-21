/**
 * Footer Component
 *
 * A responsive website footer that provides:
 * - Bilingual support (English/Chinese) with language switcher
 * - Social media icons
 * - Copyright
 * - Multiple office location information
 *
 * Used as the main footer for all pages in the application.
 */

export default function Footer() {
  return (
    <footer className="bg-[#2B3A4D] text-white py-12 px-8" id="footer">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Los Angeles Office */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-amber-400">Los Angeles Office – HQ</h3>
          <div className="space-y-3">
            <p>
              <a
                href="https://maps.app.goo.gl/h7ux4NDvi2t4JksQ7"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                19800 MacArthur Blvd Ste 420, Irvine CA 92612
              </a>
            </p>
            <p>Business Hours: Mon. – Fri. 9:30am - 5:30pm PST</p>
            <div className="flex items-center gap-2">
              <span>Phone:</span>
              <a href={`tel:+1 (949) 954-7996`} className="hover:text-teal-400">
                +1 (949) 954-7996
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Email:</span>
              <a href={`mailto:ca2@aet21.com`} className="hover:text-teal-400">
                ca2@aet21.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>WeChat:</span>
              <span className="hover:text-teal-400">LA9499547996</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Toll Free from China:</span>
              <span className="hover:text-teal-400">950-4041-5989/167-6208-4336</span>
            </div>
          </div>
        </div>

        {/* Miami Office */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-amber-400">Miami Office - HQ</h3>
          <div className="space-y-3">
            <p>
              <a
                href="https://maps.app.goo.gl/qs15wUVZYHRtfZJP9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                15321 S Dixie Hwy, #302, Palmetto Bay, FL 33157
              </a>
            </p>
            <p>Business Hours: Mon. – Fri. 9:00am - 5:00pm EST</p>
            <div className="flex items-center gap-2">
              <span>Phone:</span>
              <a href={`tel:+1 (786) 250-3999`} className="hover:text-teal-400">
                +1 (786) 250-3999 /
              </a>
              <a href={`tel:+1 (786) 881-7058`} className="hover:text-teal-400">
                +1 (786) 881-7058
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Email:</span>
              <a href={`mailto:info@aet21.com`} className="hover:text-teal-400">
                info@aet21.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>WeChat:</span>
              <span className="hover:text-teal-400">AET-Miami</span>
            </div>
            <div className="flex items-center gap-2">
              <span>WhatsApp:</span>
              <span className="hover:text-teal-400">786-881-7058</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Toll Free from China:</span>
              <span className="hover:text-teal-400">950 4037 9459</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Fax:</span>
              <span className="hover:text-teal-400">954 644 7787</span>
            </div>
          </div>
        </div>

        {/* San Francisco Office */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-amber-400">San Francisco Office</h3>
          <div className="space-y-3">
            <p>
              <a
                href="https://maps.app.goo.gl/aHKSWpskz1KTdzfY9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400"
              >
                851 Burlway Rd Ste 421, Burlingame CA 94010
              </a>
            </p>
            <p>Business Hours: Mon. – Fri. 9:00am - 5:00pm PST</p>
            <div className="flex items-center gap-2">
              <span>Phone:</span>
              <a href={`tel:+1 (415) 868-4892`} className="hover:text-teal-400">
                +1 (415) 868-4892
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>Email:</span>
              <a href={`mailto:ca@aet21.com`} className="hover:text-teal-400">
                ca@aet21.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>WeChat:</span>
              <span className="hover:text-teal-400">18611291421</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Toll Free from China:</span>
              <span className="hover:text-teal-400">950-4044-1214/167-1526-5057</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
