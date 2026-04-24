import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuthSession } from "../auth/authStorage.js";
import "../styles/terms-agreement.css";

export default function TermsAgreementPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [terms, setTerms] = useState([]);
  const [agreed, setAgreed] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const signupToken = state?.signupToken;

  useEffect(() => {
    if (!signupToken) {
      navigate("/", { replace: true });
      return;
    }

    // /api 는 Vite proxy(개발) 또는 Nginx(프로덕션)가 백엔드로 전달
    fetch("/api/terms")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data.length > 0) {
          setTerms(res.data);
          const init = {};
          const initExpanded = {};
          res.data.forEach((t) => {
            init[t.termsId] = false;
            initExpanded[t.termsId] = false;
          });
          setAgreed(init);
          setExpanded(initExpanded);
        } else {
          setError("약관 데이터를 불러오지 못했습니다. 관리자에게 문의하세요.");
        }
      })
      .catch(() => setError("약관을 불러오는 중 오류가 발생했습니다. 새로고침 해주세요."))
      .finally(() => setLoading(false));
  }, [signupToken, navigate]);

  const allRequired = terms
    .filter((t) => t.isRequired === "Y")
    .every((t) => agreed[t.termsId]);

  const agreeAll = (checked) => {
    const next = {};
    terms.forEach((t) => { next[t.termsId] = checked; });
    setAgreed(next);
  };

  const toggle = (id) => setAgreed((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = async () => {
    if (!allRequired) return;
    setSubmitting(true);
    try {
      const agreements = terms.map((t) => ({
        termsId: t.termsId,
        agreed: agreed[t.termsId] ?? false,
      }));

      const res = await fetch("/api/terms/agree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupToken, agreements }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "동의 저장 실패");
      }

      // 약관 동의 완료 후 백엔드에서 받은 진짜 토큰으로 세션 저장
      const auth = data.data;
      saveAuthSession({
        accessToken: auth.accessToken,
        member: {
          memberId: auth.memberId,
          email: auth.email,
          name: auth.name,
          role: auth.role,
        },
      });
      navigate("/main", { replace: true });
    } catch (e) {
      setError(e.message || "동의 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="terms-page--loading">
        <p className="terms-page__loading-text">약관을 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="terms-page">
      <div className="terms-card">
        {/* Header */}
        <div className="terms-header">
          <div className="terms-header__logo">🕌</div>
          <h1 className="terms-header__title">NoorSchool</h1>
          <p className="terms-header__subtitle-ko">서비스 이용을 위해 아래 약관에 동의해 주세요</p>
          <p className="terms-header__subtitle-ar">للمتابعة، يرجى قراءة الشروط والموافقة عليها</p>
        </div>

        {error && <div className="terms-error-box">{error}</div>}

        {/* Agree All */}
        <div className="terms-agree-all">
          <input
            id="agree-all"
            type="checkbox"
            checked={terms.length > 0 && terms.every((t) => agreed[t.termsId])}
            onChange={(e) => agreeAll(e.target.checked)}
            className="terms-checkbox"
          />
          <label htmlFor="agree-all" className="terms-agree-all__label">
            전체 동의 / الموافقة على جميع الشروط
          </label>
        </div>

        <div className="terms-divider" />

        {/* Terms list */}
        <div className="terms-list">
          {terms.map((term) => (
            <div key={term.termsId} className="terms-item">
              <div className="terms-item__header">
                <div className="terms-item__check-row">
                  <input
                    id={`term-${term.termsId}`}
                    type="checkbox"
                    checked={agreed[term.termsId] ?? false}
                    onChange={() => toggle(term.termsId)}
                    className="terms-checkbox"
                  />
                  <label htmlFor={`term-${term.termsId}`} className="terms-item__title-label">
                    <span className="terms-item__title-ar">{term.titleAr}</span>
                    <span className={term.isRequired === "Y" ? "terms-item__badge--required" : "terms-item__badge--optional"}>
                      {term.isRequired === "Y" ? " (필수 / إلزامي)" : " (선택 / اختياري)"}
                    </span>
                  </label>
                </div>
                <button
                  type="button"
                  className="terms-item__expand-btn"
                  onClick={() => toggleExpand(term.termsId)}
                >
                  {expanded[term.termsId] ? "▲ 접기" : "▼ 펼치기"}
                </button>
              </div>

              {expanded[term.termsId] && (
                <div className="terms-item__content">
                  <div className="terms-item__content-inner">
                    {term.contentAr.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className={
                          line.trim() === ""
                            ? "terms-item__content-empty"
                            : "terms-item__content-line"
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allRequired || submitting}
          className="terms-submit-btn"
        >
          {submitting ? "저장 중..." : "동의하고 시작하기 / الموافقة والمتابعة"}
        </button>

        {!allRequired && (
          <p className="terms-warning-note">필수 약관에 모두 동의해야 서비스를 이용할 수 있습니다.</p>
        )}

        <p className="terms-footer-note">
          약관은 언제든지 계정 설정에서 다시 확인할 수 있습니다.
        </p>
      </div>
    </main>
  );
}
