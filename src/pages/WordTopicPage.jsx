import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken, getMember } from "../auth/authStorage.js";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import "../styles/word-topic-page.css";

export const WORD_TOPIC_ITEMS = [
  { id: "random", title: "اختبار عشوائي", desc: "أسئلة مفردات مخصصة لليوم بشكل عشوائي.", level: "ALL" },
];

export default function WordTopicPage() {
  const navigate = useNavigate();
  const accessToken = useMemo(() => getAccessToken(), []);
  const member = useMemo(() => getMember(), []);

  useEffect(() => {
    if (!accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, navigate]);

  if (!accessToken) return null;

  return (
    <div className="word-topic-beta-page" dir="rtl">
      <SiteHeader />
      <main className="word-topic-beta-page__main" aria-labelledby="word-topic-beta-title">
        <section className="word-topic-beta-hero">
          <p className="word-topic-beta-hero__label">معاينة تجريبية</p>
          <h1 id="word-topic-beta-title">قائمة اختبارات المفردات</h1>
          <p className="word-topic-beta-hero__desc">
            {member?.name ? `${member.name}` : "المتعلم"}, ما الموضوع الذي تريد البدء به اليوم؟
          </p>
          <div className="word-topic-beta-hero__actions">
            <Link to="/main" className="word-topic-beta-btn word-topic-beta-btn--ghost">
              العودة إلى الرئيسية
            </Link>
            <Link to="/words/study/random" className="word-topic-beta-btn">
              ابدأ الاختبار العشوائي الآن
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
