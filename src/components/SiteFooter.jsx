import { FaInstagram } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

/**
 * 랜딩 하단 공통 푸터
 * - 정책/이용약관 링크를 모아두고
 * - 서비스 표기를 간단히 보여줍니다.
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();
  const contactEmail = "ani.ana.yungi@gmail.com";
  const instagramUrl = "https://www.instagram.com/deer.s__feet/";

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <p className="site-footer__copy" lang="en" dir="ltr">
          © {year} NoorSchool. All rights reserved.
        </p>
        <nav className="site-footer__links" aria-label="푸터 링크">
          <a href="#">سياسة الخصوصية</a>
          <a href="#">شروط الاستخدام</a>
          <a
            href={`mailto:${contactEmail}`}
            aria-label="Email"
            title={contactEmail}
          >
            <FcGoogle aria-hidden="true" size={20} />
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <FaInstagram aria-hidden="true" color="#e1306c" size={20} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
